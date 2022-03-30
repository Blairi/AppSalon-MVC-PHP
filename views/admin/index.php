<h1 class="nombre-pagina">Panel de Administración</h1>
<?php include_once __DIR__ . "/../templates/barra.php"; ?>

<h2>Buscar Citas por...</h2>

<div class="buscador">
    <select id="buscador">
        <option value="hoy">Citas de Hoy</option>
        <option value="fecha">Citas por Fecha</option>
        <option value="todas">Todas las Citas</option>
    </select>
    <div id="inputs"></div>
</div>

<h3 id="titulo-buscador">Citas de Hoy</h3>

<div id="citas"></div>

<?php
$script = "<script src='build/js/buscador.js'></script>";
?>