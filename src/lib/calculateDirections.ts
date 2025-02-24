import { Direction, Station } from "./schemas/calculations";
import { stations } from "./places";
import { toast } from "sonner";

const EARTH_RADIUS = 6371e3; // Earth radius in meters

function calculateDistance(
    coord1: { lon: number; lat: number },
    coord2: { lon: number; lat: number }
): number {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const lat1 = toRadians(coord1.lat);
    const lat2 = toRadians(coord2.lat);
    const deltaLat = toRadians(coord2.lat - coord1.lat);
    const deltaLon = toRadians(coord1.lon - coord2.lon);

    const a =
        Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS * c; // in meters
}

function findStation(name: string): Station | undefined {
    return stations.find((station) => station.name === name);
}

function getMethodCostSpeed(type: string, distance: number) {
    const methods: Record<string, any> = {
        bus: { method: "bus", cost: 25, speed: 500, icon: "🚌", color: "#FFA500", weight: 1.2 },
        tramway: {
            method: "tramway",
            cost: 40,
            speed: 600,
            icon: "🚊",
            color: "#54A9FF",
            weight: 1.0,
        },
        metro: { method: "metro", cost: 50, speed: 800, icon: "🚄", color: "#224488", weight: 0.8 },
        telepherique: {
            method: "telepherique",
            cost: 30,
            speed: 400,
            icon: "🚡",
            color: "#8A2BE2",
            weight: 1.1,
        },
        foot: { method: "foot", cost: 0, speed: 40, icon: "🚶", color: "#40A060", weight: 2.0 },
        default: {
            method: "unknown",
            cost: 0,
            speed: 1,
            icon: "❓",
            color: "#808080",
            weight: 3.0,
        },
    };
    return methods[type] || methods.default;
}

function deltaDirection(
    from: { lon: number; lat: number },
    to: { lon: number; lat: number }
): string {
    const delta = { lon: to.lon - from.lon, lat: to.lat - from.lat };
    const angle = (Math.atan2(delta.lat, delta.lon) * 180) / Math.PI;
    if (angle >= -22.5 && angle < 22.5) return "east";
    if (angle >= 22.5 && angle < 67.5) return "north-east";
    if (angle >= 67.5 && angle < 112.5) return "north";
    if (angle >= 112.5 && angle < 157.5) return "north-west";
    if (angle >= 157.5 || angle < -157.5) return "west";
    if (angle >= -157.5 && angle < -112.5) return "south-west";
    if (angle >= -112.5 && angle < -67.5) return "south";
    if (angle >= -67.5 && angle < -22.5) return "south-east";
    return "unknown";
}

export function calculateDirections(departure: string, destination: string): Direction[] {
    console.time("calculateDirections");
    const startStation = findStation(departure);
    const endStation = findStation(destination);

    if (!startStation || !endStation) {
        throw new Error("Invalid station names.");
    }

    const durations: Record<string, number> = {};
    const previous: Record<string, Direction | null> = {};

    stations.forEach((s) => {
        durations[s.name] = Infinity;
        previous[s.name] = null;
    });
    durations[startStation.name] = 0;

    const queue: { name: string; duration: number }[] = [{ name: startStation.name, duration: 0 }];

    while (queue.length > 0) {
        queue.sort((a, b) => {
            const weightA = previous[a.name]
                ? getMethodCostSpeed(previous[a.name]!.method, 0).weight
                : 1;
            const weightB = previous[b.name]
                ? getMethodCostSpeed(previous[b.name]!.method, 0).weight
                : 1;
            return a.duration * weightA - b.duration * weightB;
        });

        const { name: currentName, duration: currentDur } = queue.shift()!;
        if (currentName === endStation.name) break;
        if (currentDur > durations[currentName]) continue;

        const currentStation = findStation(currentName);
        if (!currentStation) continue;

        currentStation.leads_to.forEach((nextName) => {
            const nextStation = findStation(nextName);
            if (!nextStation) return;

            const distance = calculateDistance(currentStation.coordinates, nextStation.coordinates);
            const { method, cost, speed, icon, color } = getMethodCostSpeed(
                nextStation.type,
                distance
            );
            const stepDuration = distance / speed;
            const alt = currentDur + stepDuration;

            if (alt < durations[nextName]) {
                durations[nextName] = alt;
                previous[nextName] = {
                    from: currentStation.name,
                    to: nextStation.name,
                    distance: Math.ceil(distance),
                    direction: deltaDirection(
                        currentStation.coordinates,
                        nextStation.coordinates
                    ) as any,
                    duration: Math.ceil(stepDuration),
                    cost,
                    method,
                    icon,
                    color,
                    from_coords: currentStation.coordinates,
                    to_coords: nextStation.coordinates,
                };
                queue.push({ name: nextName, duration: alt });
            }
        });

        const walkStations = stations
            .filter((walkStation) => walkStation.name !== currentStation.name)
            .map((walkStation) => ({
                station: walkStation,
                distance: calculateDistance(currentStation.coordinates, walkStation.coordinates),
            }))
            .filter(({ distance }) => distance <= 1400)
            .filter(({ station }) => !currentStation.leads_to.includes(station.name))
            .sort((a, b) => a.distance - b.distance);


        walkStations.forEach(({ station: walkStation, distance }) => {
            const stepDuration = distance / 40;
            const alt = currentDur + stepDuration;
            const lastStepWasWalking = previous[currentName]?.method === "foot";

            if (!lastStepWasWalking && alt < durations[walkStation.name]) {
                durations[walkStation.name] = alt;
                previous[walkStation.name] = {
                    from: currentStation.name,
                    to: walkStation.name,
                    distance: Math.ceil(distance),
                    duration: Math.ceil(stepDuration),
                    direction: deltaDirection(
                        currentStation.coordinates,
                        walkStation.coordinates
                    ) as any,
                    cost: 0,
                    method: "foot",
                    icon: "🚶",
                    color: "#40A060",
                    from_coords: currentStation.coordinates,
                    to_coords: walkStation.coordinates,
                };
                queue.push({ name: walkStation.name, duration: alt });
            }
        });
    }



    if (durations[endStation.name] === Infinity) {
        throw new Error("No path found.");
    }

    const path: Direction[] = [];
    let current = endStation.name;
    while (current !== startStation.name) {
        const prev = previous[current];
        if (!prev) {
            throw new Error("No path found.");
        }
        path.push(prev);
        current = prev.from;
    }
    path.reverse();
    console.timeEnd("calculateDirections");

    return mergePath(path);
    
   
    
}

export function mergePath(path: Direction[]): Direction[] {
    const mergedPath: Direction[] = [];
    path.forEach((current) => {
        if (mergedPath.length > 0) {
            const last = mergedPath[mergedPath.length - 1];
            if (last.method === current.method) {
                const match = last.to.match(/\((\d+) station/);
                const stationCount = match ? parseInt(match[1]) + 1 : 2;
                last.to = `${current.to} (${stationCount} station${stationCount > 1 ? "s" : ""})`;
                last.distance += current.distance;
                last.duration += current.duration;
                last.cost = current.cost;
                last.to_coords = current.to_coords;
                return;
            }
        }
        mergedPath.push({ ...current });
    });
    return mergedPath;
}
// Carbon emission factors (kg CO2 per kilometer)
const CARBON_FACTORS = {
    bus: 0.089,      // Average bus emissions per passenger
    metro: 0.041,    // Metro/train emissions per passenger
    tramway: 0.035,  // Tramway emissions per passenger
    telepherique: 0.025, // Cable car estimated emissions
    foot: 0,         // Walking has no direct emissions
    car: 0.171       // Average car emissions for comparison
};

interface CarbonMetrics {
    actualCarbon: number;    // Carbon emitted by chosen transport
    expectedCarbon: number;  // Carbon if taken by car
    savedCarbon: number;     // Difference between actual and expected
    breakdown: {
        method: string;
        distance: number;
        carbonEmitted: number;
    }[];
}

function calculateCarbonMetrics(directions: Direction[]): CarbonMetrics {
    let actualCarbon = 0;
    let expectedCarbon = 0;
    const breakdown: any[] = [];

    directions.forEach(direction => {
     
        const distanceKm = direction.distance / 1000;
      
        const carbonFactor = CARBON_FACTORS[direction.method as keyof typeof CARBON_FACTORS] || 0;
        const segmentCarbon = distanceKm * carbonFactor;
        
    
        const carSegmentCarbon = distanceKm * CARBON_FACTORS.car;
        
        actualCarbon += segmentCarbon;
        expectedCarbon += carSegmentCarbon;

        breakdown.push({
            method: direction.method,
            distance: direction.distance,
            carbonEmitted: segmentCarbon
        });
    });

    const savedCarbon = expectedCarbon - actualCarbon;

    return {
        actualCarbon: Number(actualCarbon.toFixed(3)),
        expectedCarbon: Number(expectedCarbon.toFixed(3)),
        savedCarbon: Number(savedCarbon.toFixed(3)),
        breakdown
    };
}

async function sendCarbonData(carbonMetrics: CarbonMetrics) {
    try {
        const response = await fetch('/api/carbon-metrics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carbonMetrics)
        });

        if (!response.ok) {
            throw new Error('Failed to send carbon metrics');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending carbon metrics:', error);
        toast.error('Failed to save carbon metrics');
        throw error;
    }
}


export function calculateDirectionsWithCarbon(departure: string, destination: string): { directions: Direction[], carbonMetrics: CarbonMetrics } {
    const directions = calculateDirections(departure, destination);
    const carbonMetrics = calculateCarbonMetrics(directions);
    
 
    sendCarbonData(carbonMetrics).catch(console.error);
    
    return { directions, carbonMetrics };
}

