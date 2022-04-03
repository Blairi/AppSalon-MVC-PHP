<h1 class="nombre-pagina" data-cy="titulo-login">Login</h1>
<p class="descripcion-pagina">Iniciar sesión con tus datos</p>
<?php include_once __DIR__ . "/../templates/alertas.php"; ?>
<form data-cy="formulario-login" class="formulario" method="POST" action="/">
    <div class="campo">
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            placeholder="Tu Email"
            name="email"
            data-cy="input-email"
        />
    </div>

    <div class="campo">
        <label for="password">Password</label>
        <input
            type="password"
            id="password"
            placeholder="Tu Password"
            name="password"
            data-cy="input-password"
        />
    </div>

    <input type="submit" value="Iniciar Sesión" class="boton">
</form>

<div class="acciones">
    <a href="/crear-cuenta" data-cy="btn-crear-cuenta">¿Aún no tienes una cuenta? Crear una</a>
    <a href="/olvide">¿Olvidaste tu password?</a>
</div>