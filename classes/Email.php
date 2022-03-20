<?php

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email{

    public $email;
    public $nombre;
    public $token;

    public function __construct($email, $nombre, $token){
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }


    public function enviarConfirmacion(){

        // Crear el objeto de email
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = "tls";
        $mail->Host = 'smtp.gmail.com';
        $mail->Port = 587;
        $mail->Username = $_ENV["E_MAIL"];
        $mail->Password = $_ENV["E_PASS"];

        $mail->setFrom($_ENV["E_MAIL"], "App Salón");
        $mail->addAddress($this->email, $this->nombre);
        $mail->Subject = "Confirma tu cuenta";

        // Set HTML
        $mail->isHTML(TRUE);
        $mail->CharSet = "UTF-8";

        $contenido = '<html>';
        $contenido .= '<p><strong>Hola ' . $this->nombre .'</strong> Has creado tu cuenta en App Salon, solo debes confirmarla presionando el siguiente enlace</p>';
        $contenido .= '<p>Presiona aquí: <a href="';
        $contenido .= "http://localhost";
        $contenido .= '/confirmar-cuenta?token='. $this->token .'">Confirmar Cuenta</a></p>';
        $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar el mensaje.</p>";
        $contenido .= '</html>';

        $mail->Body = $contenido;
        

        //Enviar el email
        $mail->send();
    }


    public function enviarInstrucciones(){

        // Crear el objeto de email
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = "tls";
        $mail->Host = 'smtp.gmail.com';
        $mail->Port = 587;
        $mail->Username = $_ENV["E_MAIL"];
        $mail->Password = $_ENV["E_PASS"];

        $mail->setFrom($_ENV["E_MAIL"], "App Salón");
        $mail->addAddress($this->email, $this->nombre);
        $mail->Subject = "Restablece tu password";

        // Set HTML
        $mail->isHTML(TRUE);
        $mail->CharSet = "UTF-8";

        $contenido = '<html>';
        $contenido .= '<p><strong>Hola ' . $this->nombre .'</strong> Has solicitado restablecer tu password, sigue el siguiente enlace para hacerlo.</p>';
        $contenido .= '<p>Presiona aquí: <a href="http://localhost/recuperar?token='. $this->token .'">Restablecer Password</a></p>';
        $contenido .= "<p>Si tú no solicitaste este cambio, puedes ignorar el mensaje.</p>";
        $contenido .= '</html>';

        $mail->Body = $contenido;
        

        //Enviar el email
        $mail->send();
    }

}
