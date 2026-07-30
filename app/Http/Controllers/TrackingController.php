<?php

namespace App\Http\Controllers;

use App\Events\BusLocationUpdated;
use App\Models\Jadwal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrackingController extends Controller
{
    /**
     * Display the mobile web schedule selection portal for Supir (Driver).
     */
    public function supirIndex(): Response
    {
        $today = now()->toDateString();
        $jadwals = Jadwal::with(['bus.poBus', 'rute'])
            ->whereDate('tanggal', $today)
            ->orderBy('jam_keberangkatan')
            ->get();

        return Inertia::render('supir/index', [
            'jadwals' => $jadwals,
        ]);
    }

    /**
     * Display the mobile web tracking page for Supir (Driver).
     */
    public function showDriverTracking(int $id_jadwal): Response
    {
        $jadwal = Jadwal::with(['bus.poBus', 'rute'])
            ->findOrFail($id_jadwal);

        return Inertia::render('supir/tracking', [
            'jadwal' => $jadwal,
        ]);
    }

    /**
     * Receive continuous GPS coordinates from Supir and broadcast via Reverb WebSockets.
     */
    public function updateLocation(Request $request, int $id_jadwal): JsonResponse
    {
        $validated = $request->validate([
            'lat'     => 'required|numeric',
            'lng'     => 'required|numeric',
            'heading' => 'nullable|numeric',
            'speed'   => 'nullable|numeric',
        ]);

        $jadwal = Jadwal::findOrFail($id_jadwal);

        // Auto-update status to 'berangkat' when tracking starts if currently 'menunggu'
        if ($jadwal->status_bus === 'menunggu') {
            $jadwal->update(['status_bus' => 'berangkat']);
        }

        $lat = (float) $validated['lat'];
        $lng = (float) $validated['lng'];
        $heading = isset($validated['heading']) ? (float) $validated['heading'] : null;
        $speed = isset($validated['speed']) ? (float) $validated['speed'] : null;

        // Broadcast event to WebSocket subscribers
        event(new BusLocationUpdated(
            id_jadwal: $jadwal->id_jadwal,
            lat: $lat,
            lng: $lng,
            heading: $heading,
            speed: $speed,
            status_bus: $jadwal->status_bus
        ));

        return response()->json([
            'status'     => 'success',
            'message'    => 'Lokasi bus berhasil dipancarkan.',
            'status_bus' => $jadwal->status_bus,
            'data'       => [
                'lat'     => $lat,
                'lng'     => $lng,
                'heading' => $heading,
                'speed'   => $speed,
            ],
        ]);
    }

    /**
     * Mark journey as finished by Supir.
     */
    public function finishJourney(Request $request, int $id_jadwal): JsonResponse
    {
        $jadwal = Jadwal::findOrFail($id_jadwal);
        $jadwal->update(['status_bus' => 'selesai']);

        $lat = $request->input('lat', 0.0);
        $lng = $request->input('lng', 0.0);

        // Broadcast finish event
        event(new BusLocationUpdated(
            id_jadwal: $jadwal->id_jadwal,
            lat: (float) $lat,
            lng: (float) $lng,
            status_bus: 'selesai'
        ));

        return response()->json([
            'status'  => 'success',
            'message' => 'Perjalanan selesai.',
            'status_bus' => 'selesai',
        ]);
    }
}
