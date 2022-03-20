<?php

namespace Controllers;

use Model\Cita;
use Model\AdminCita;
use Model\CitaServicio;
use Model\Servicio;

class APIController{
    public static function index(){
        isAuth();
        $servicios = Servicio::all();
        echo json_encode($servicios);
    }

    public static function guardar(){

        // Almacena la Cita  y devuelve el ID
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();

        $id = $resultado["id"];

        // Almacena la Cita y el Servicio

        // Almacena los Servicios con el ID de la cita
        $idServicios = explode(",", $_POST["servicios"]);
        foreach($idServicios as $idServicio){
            $args = [
                "citaId" => $id,
                "servicioId" =>$idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }

        echo json_encode(["resultado" => $resultado]);

    }

    public static function eliminar(){
        if($_SERVER["REQUEST_METHOD"] === "POST"){
            $id = $_POST["id"];
            $cita = Cita::find($id);
            $cita->eliminar();
            header("Location: " . $_SERVER["HTTP_REFERER"]);
        }
    }

    public static function vercitas(){
        isAdmin();
        // Consultar la base de datos
        $consulta = "SELECT citas.id, citas.hora, citas.fecha, CONCAT( usuarios.nombre, ' ', usuarios.apellido) as cliente, ";
        $consulta .= " usuarios.email, usuarios.telefono, servicios.nombre as servicio, servicios.precio  ";
        $consulta .= " FROM citas  ";
        $consulta .= " LEFT OUTER JOIN usuarios ";
        $consulta .= " ON citas.usuarioId=usuarios.id  ";
        $consulta .= " LEFT OUTER JOIN citasServicios ";
        $consulta .= " ON citasServicios.citaId=citas.id ";
        $consulta .= " LEFT OUTER JOIN servicios ";
        $consulta .= " ON servicios.id=citasServicios.servicioId ";

        $citas = AdminCita::SQl($consulta);
        echo json_encode($citas);
    }
}