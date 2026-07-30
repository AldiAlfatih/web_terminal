<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;

use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BusLocationUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $id_jadwal;
    public float $lat;
    public float $lng;
    public ?float $heading;
    public ?float $speed;
    public string $status_bus;

    /**
     * Create a new event instance.
     */
    public function __construct(int $id_jadwal, float $lat, float $lng, ?float $heading = null, ?float $speed = null, string $status_bus = 'berangkat')
    {
        $this->id_jadwal = $id_jadwal;
        $this->lat = $lat;
        $this->lng = $lng;
        $this->heading = $heading;
        $this->speed = $speed;
        $this->status_bus = $status_bus;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('tracking.jadwal.' . $this->id_jadwal),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'BusLocationUpdated';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id_jadwal'  => $this->id_jadwal,
            'lat'        => $this->lat,
            'lng'        => $this->lng,
            'heading'    => $this->heading,
            'speed'      => $this->speed,
            'status_bus' => $this->status_bus,
            'timestamp'  => now()->toIso8601String(),
        ];
    }
}
