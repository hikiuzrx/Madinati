"use client";

import { useState } from "react";
import { toast } from "sonner";
import LocationPicker from "./LocationPicker";
import Map from "./MapCard";
import DirectionsCard from "./DirectionsCard";
import HistoryCard from "./HistoryCard";
import { Button } from "@/components/ui/button";
import { calculateDirectionsWithCarbon } from "@/lib/calculateDirections";
import type { Direction } from "@/lib/schemas/calculations";
import { HistoryEntry } from "@/lib/schemas/history";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CarbonMetrics {
    actualCarbon: number;
    expectedCarbon: number;
    savedCarbon: number;
    breakdown: {
        method: string;
        distance: number;
        carbonEmitted: number;
    }[];
}

function CarbonCard({ metrics }: { metrics: CarbonMetrics }) {
    return (
      <Card className="bg-card text-card-foreground">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Carbon Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-secondary/30 border border-border">
              <p className="text-sm text-primary">Saved Carbon</p>
              <p className="text-lg font-bold text-primary">
                {metrics.savedCarbon.toFixed(2)} kg CO₂
              </p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/30 border border-border">
              <p className="text-sm text-muted-foreground">Actual Emissions</p>
              <p className="text-lg font-bold text-card-foreground">
                {metrics.actualCarbon.toFixed(2)} kg CO₂
              </p>
            </div>
          </div>
          <div className="mt-2 p-2 rounded-lg bg-secondary/30 border border-border">
            <p className="text-sm text-muted-foreground">
              vs. {metrics.expectedCarbon.toFixed(2)} kg CO₂ by car
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

function updateLocationHistory(
    departingLocation: string,
    destinationLocation: string,
    setHistory: (history: HistoryEntry[]) => void
) {
    const storageKey = "history";
    const entry = {
        from: departingLocation,
        to: destinationLocation,
        time: new Date().toISOString(),
    };
    try {
        const stored = localStorage.getItem(storageKey);
        const history = stored ? JSON.parse(stored) : [];
        localStorage.setItem(storageKey, JSON.stringify([entry, ...history]));
        setHistory([entry, ...history]);
    } catch {
        localStorage.setItem(storageKey, JSON.stringify([entry]));
        setHistory([entry]);
    }
}

export default function Navigation() {
    const [departingLocation, setDepartingLocation] = useState("");
    const [destinationLocation, setDestinationLocation] = useState("");
    const [directions, setDirections] = useState<Direction[]>([]);
    const [carbonMetrics, setCarbonMetrics] = useState<CarbonMetrics | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    function findRoute() {
        if (!departingLocation || !destinationLocation) {
            toast.error("Please select both departing and destination locations");
            return;
        }
        updateLocationHistory(departingLocation, destinationLocation, setHistory);
        try {
            const result = calculateDirectionsWithCarbon(departingLocation, destinationLocation);
            setDirections(result.directions);
            setCarbonMetrics(result.carbonMetrics);
        } catch {
            toast.error("No viable path found");
            setDirections([]);
            setCarbonMetrics(null);
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4">
            <div className="space-y-4">
                <Map directions={directions} />
            
                {carbonMetrics && <CarbonCard metrics={carbonMetrics} />}

            </div>
            <div className="space-y-4 h-full grid grid-rows-[auto_1fr]">
                <div className="space-y-2">
                    <LocationPicker
                        location={departingLocation}
                        set_location={setDepartingLocation}
                        label="Departing"
                    />
                    <LocationPicker
                        location={destinationLocation}
                        set_location={setDestinationLocation}
                        label="Destination"
                    />
                    <Button onClick={findRoute} className="w-full">
                        <span className="text-lg -m-s-6">🔎</span> Find Route
                    </Button>
                </div>
                {directions.length ? (
                    <DirectionsCard directions={directions} setDirections={setDirections} />
                ) : (
                    <HistoryCard
                        setDepartingLocation={setDepartingLocation}
                        setDestinationLocation={setDestinationLocation}
                        history={history}
                        set_history={setHistory}
                    />
                )}
            </div>
        </div>
    );
}