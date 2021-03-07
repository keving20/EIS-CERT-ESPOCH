# eis-cert-espoch

eis-cert-espoch es una aplicacion que te permite guardar certificados en la blockchain de [Ethereum](https://ethereum.org/)

## INSTRUCCIONES:

### REQUISITOS: 

La aplicacion se ejecuta en **Ubuntu 16.04**  

Para ejecutar la aplicacion es necesario tener instalado el programa **Docker**  
			- Docker version 17.03.2-ce o mayor [INFO](https://docs.docker.com/install)

Para poder guardar los certificados debera tener instalada, en su navegador, la extension [Metamask](https://metamask.io/) y conectarse a la red Ropsten.

### INSTALAR eis-cert-espoch: 
La primera vez que vaya a usar la aplicacion tendra que instalarla ejecutando el siguiente script, la aplicacion se iniciara automaticamente.
```bash 
./scripts/installeis-cert-espoch.sh tu_puerto tus_archivos
```
**tu_puerto** es el puerto en el que la aplicacion estara escuchando.
**tus_archivos** es la direccion donde estaran tus carpetas *images* y *css*.

### ACCEDER A eis-cert-espoch:
La app sera accesible desde http://localhost:tu_puerto

### DESINSTALAR eis-cert-espoch: 
Para desinstalar la aplicacion ejecute el siguiente script.
```bash
./scripts/uninstalleis-cert-espoch.sh
```

### INICIAR eis-cert-espoch: 
Si ha detenido la aplicacion en algun momento, podra iniciarla con el siguiente script.
```bash
./scripts/starteis-cert-espoch.sh
```

### STOP eis-cert-espoch: 
Si quiere detener la aplicacion puede ejcutar el siguiente script.
```bash
./scripts/stopeis-cert-espoch.sh
```

### RESET eis-cert-espoch: 
Si estÃ¡ teniendo problemas para iniciar la aplicacion ejecute el siguiente script.
```bash
./scripts/reseteis-cert-espoch.sh
```


### UPDATE eis-cert-espoch: 
Para actualizar la aplicacion ejecute el siguiente script.
```bash
./scripts/updateeis-cert-espoch.sh
```

### PERSONALIZAR eis-cert-espoch: 
Personalice la aplicacion adaptandola al estilo de su organizacion. 

#### IMAGENES: 
En la carpeta "images" debera tener las imagenes de su organizacion con los siguientes nombres:  
-> logo.png (logo que aparece en la cabecera de la aplicacion)  
-> ico.png (Icono que aparece en la pestaÃ±a del explorador)  
-> firma1.png (Aparece en el certificado. Firma identificativa de la persona que certifica)  
-> firma2.png (Aparece en el certificado. Firma identificativa de la institucion que ejerce el certificado)  
-> certified.png (Aparece en el certificado. Se recomienda no modificar esta imagen)  
-> Blockchain.png (Aparece en el certificado. Se recomienda no modificar esta imagen)  
-> verified-seal-grayscale.png (Marca de agua del certificado. Se recomienda no modificar esta imagen)  
-> Puede utilizar las imagenes de la carpeta *images-test*

#### ESTILOS: 
En la carpeta "css", modifique el archivo "mystyle.css" con la informacion que crea adecuada:  

  
	/* Fondo de eis-cert-espoch */
	body {
	background: #f1f4f7 !important;
	}

	/* Tipo de fuente de eis-cert-espoch */
	body {
	font-family: sans-serif !important;
	}

	/* Dimensiones de fuente  de eis-cert-espoch */
	body {
	font-size: 14px;
	}

	/* Color (cabeceras, botones, etc) */
	.btn-primary, .btn-primary:hover, .btn-primary:focus, .btn-primary:active, .btn-primary.active, .open > .dropdown-toggle.btn-primary, .btn-primary.disabled, .btn-primary[disabled], fieldset[disabled], .btn-primary, .btn-primary.disabled:hover, .btn-primary[disabled]:hover, fieldset[disabled], .btn-primary:hover, .btn-primary.disabled:focus, .btn-primary[disabled]:focus, fieldset[disabled], .btn-primary:focus, .btn-primary.disabled:active, .btn-primary[disabled]:active, fieldset[disabled], .btn-primary:active, .btn-primary.disabled.active, .btn-primary[disabled].active, fieldset[disabled], .btn-primary.active, .bg-info, .bg-blue a.bg-info:hover, a.bg-blue:hover, .label-info, .label-info[href]:hover, .label-info[href]:focus, .panel-primary > .panel-heading, .panel-info > .panel-heading, .timeline-badge.primary, .timeline-badge.info, .progress-bar, .progress-bar-info, .progress-bar-blue, .sidebar ul.nav a:hover, .sidebar ul.nav li.parent ul li a:hover, .sidebar ul.nav, .active a, .sidebar ul.nav li.parent a.active, .sidebar ul.nav, .active > a:hover, .sidebar ul.nav li.parent a.active:hover, .sidebar ul.nav, .active > a:focus, .sidebar ul.nav li.parent a.active:focus, .sidebar ul.nav li.current a, .datepicker table tr td.active, .datepicker table tr td.active:hover, .datepicker table tr td.active.disabled, .datepicker table tr td.active.disabled:hover, .datepicker table tr td.active:hover, .datepicker table tr td.active:hover:hover, .datepicker table tr td.active.disabled:hover, .datepicker table tr td.active.disabled:hover:hover, .datepicker table tr td.active:focus, .datepicker table tr td.active:hover:focus, .datepicker table tr td.active.disabled:focus, .datepicker table tr td.active.disabled:hover:focus, .datepicker table tr td.active:active, .datepicker table tr td.active:hover:active, .datepicker table tr td.active.disabled:active, .datepicker table tr td.active.disabled:hover:active, .datepicker table tr td.active.active, .datepicker table tr td.active:hover.active, .datepicker table tr td.active.disabled.active, .datepicker table tr td.active.disabled:hover.active, .open, .dropdown-toggle.datepicker table tr td.active, .open, .dropdown-toggle.datepicker table tr td.active:hover, .open, .dropdown-toggle.datepicker table tr td.active.disabled, .open, .dropdown-toggle.datepicker table tr td.active.disabled:hover  {
	background-color: #4fe907 !important;
	}

	/* Dimensiones logo.png */
	#logo {
	width: 10px; 
	height: 90px;
	}

	/* Dimensiones firma1.png */
	#firma1 {
	width: 305px !important; 
	height: 90px !important;
	}

	/* Dimensiones firma2.png */
	#firma2 {
	width: 305px !important; 
	height: 90px !important;
	}

	/* Dimensiones certified.png */
	#certified {
	width: 305px !important; 
	height: 90px !important;
	}

	/* TamaÃ±o Blockchain.png */
	#Blockchain {
	width: 305px !important; 
	height: 90px !important;
	}

	/* Dimensiones verified-seal-grayscale.png */
	#verified-seal-grayscale {
	width: 305px !important; 
	height: 90px !important;
	}


