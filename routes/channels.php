<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Public channel for bus location tracking per schedule ID
Broadcast::channel('tracking.jadwal.{id_jadwal}', function () {
    return true;
});
