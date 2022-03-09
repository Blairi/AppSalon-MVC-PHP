<?php

namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;

class LoginController{
    public static function login(Router $router){

        $alertas = [];

        if($_SERVER["REQUEST_METHOD"] === "POST"){
            $auth = new Usuario($_POST);
            $alertas = $auth->validarLogin();

            if(empty($alertas)){
                // Comprobar que exista el usuario
                $usuario = Usuario::where("email", $auth->email);

                if($usuario){
                    // Verificar el password
                    if($usuario->comprobarPasswordAndVerificado($auth->password)){
                        // Autenticar el usuario
                        if(!isset($_SESSION)) {
                            session_start();
                        };
                        $_SESSION["id"] = $usuario->id;
                        $_SESSION["nombre"] = $usuario->nombre . " " . $usuario->apellido;
                        $_SESSION["email"] = $usuario->email;
                        $_SESSION["login"] = true;
                        
                        // Rediccionamiento
                        if($usuario->admin === "1"){
                            $_SESSION["admin"] = $usuario->admin ?? null;
                            header("Location: /admin");
                        }
                        else{
                            header("Location: /cita");
                        }
                        
                    }
                }
                else{
                    Usuario::setAlerta("error", "Usuario no encontrado");
                }
            }
        }

        $alertas = Usuario::getAlertas();

        $router->render("auth/login", [
            "alertas" => $alertas
        ]);
    }


    public static function logout(){
        echo "Desde logout xd";
    }


    public static function olvide(Router $router){
        $router->render("auth/olvide-password", []);
    }

    
    public static function recuperar(){
        echo "Desde recuperar xd";
    }


    public static function crear(Router $router){

        $usuario = new Usuario;

        // Alertas vacias
        $alertas = [];

        if($_SERVER["REQUEST_METHOD"] === "POST"){
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();

            // Revisar que alertas este vacio
            if(empty($alertas)){
                // Verificar que el usuario no este registrado
                $resultado = $usuario->existeUsuario();

                if($resultado->num_rows){
                    $alertas = Usuario::getAlertas();
                }
                else{

                    // Hasehar el Password
                    $usuario->hashPassword();

                    // Generar un Token unico
                    $usuario->crearToken();

                    // Enviar el email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);

                    $email->enviarConfirmacion();

                    // Crear el usuario
                    $resultado = $usuario->guardar();
                    if($resultado){
                        header("Location: /mensaje");
                    }

                }
            }
        }

        $router->render("auth/crear-cuenta", [
            "usuario" => $usuario,
            "alertas" => $alertas
        ]);
    }

    public static function mensaje(Router $router){
        $router->render("auth/mensaje", []);
    }

    public static function confirmar(Router $router){

        $alertas = [];

        $token = s($_GET["token"]);

        $usuario = Usuario::where("token", $token);

        if(empty($usuario)){
            // Mostrar mensaje de error
            Usuario::setAlerta("error", "Token No Válido");
        }
        else{
            // Modificar al usuario confirmado
            $usuario->confirmado = 1;
            $usuario->token = "";
            $usuario->guardar();
            Usuario::setAlerta("exito", "Cuenta Comprobada Correctamente");
        }

        // Obtener alertas
        $alertas = Usuario::getAlertas();

        // Renderizar la vista
        $router->render("auth/confirmar-cuenta", [
            "alertas" => $alertas
        ]);
    }

}