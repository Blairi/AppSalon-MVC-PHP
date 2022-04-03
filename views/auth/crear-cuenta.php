<h1 class="nombre-pagina" data-cy="titulo-crear">Crear Cuenta</h1>
<p class="descripcion-pagina">Llena el siguiente formulario para crear una cuenta</p>

<?php include_once __DIR__ . "/../templates/alertas.php"; ?>

<form method="POST" action="/crear-cuenta" class="formulario">
    <div class="campo">
        <label for="nombre">Nombre</label>
        <input 
            data-cy="input-nombre"
            type="text" 
            name="nombre" 
            id="nombre"
            placeholder="Tu Nombre"
            value="<?php echo s($usuario->nombre); ?>"
        />
    </div>

    <div class="campo">
        <label for="apellido">Apellido</label>
        <input 
            data-cy="input-apellido"
            type="text" 
            name="apellido" 
            id="apellido"
            placeholder="Tu Apellido"
            value="<?php echo s($usuario->apellido); ?>"
        />
    </div>

    <div class="campo">
        <label for="telefono">Teléfono</label>
        <input 
            data-cy="input-telefono"
            type="tel" 
            name="telefono" 
            id="telefono"
            placeholder="Tu Teléfono"
            value="<?php echo s($usuario->telefono); ?>"
        />
    </div>

    <div class="campo">
        <label for="email">E-mail</label>
        <input 
            data-cy="input-email"
            type="email" 
            name="email" 
            id="email"
            placeholder="Tu E-mail"
            value="<?php echo s($usuario->email); ?>"
        />
    </div>

    <div class="campo">
        <label for="password">Password</label>
        <input 
            data-cy="input-password"
            type="password" 
            name="password" 
            id="password"
            placeholder="Tu Password"
        />
    </div>

    <input type="submit" value="Crear Cuenta" class="boton" data-cy="btn-crear">

</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia Sesión</a>
    <a href="/olvide">¿Olvidaste tu password?</a>
</div>