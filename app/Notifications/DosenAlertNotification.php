<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class DosenAlertNotification extends Notification
{
    use Queueable;

    private $message;
    private $type;

    // Kita terima pesan dan tipe notifikasinya
    public function __construct($message, $type = 'info')
    {
        $this->message = $message;
        $this->type = $type;
    }

    // Beritahu Laravel untuk menyimpannya ke database
    public function via($notifiable)
    {
        return ['database'];
    }

    // Format data yang akan disimpan ke tabel
    public function toArray($notifiable)
    {
        return [
            'message' => $this->message,
            'type'    => $this->type,
        ];
    }
}