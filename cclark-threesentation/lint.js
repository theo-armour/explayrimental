	if ( ! Detector.webgl ) { Detector.addGetWebGLMessage(); }

	document.body.style.backgroundColor = '#000';
	document.body.style.font = 'bold 12pt monospace';
	document.body.style.margin = '0';
	document.body.style.overflow = 'hidden';
	document.body.style.textAlign = 'center';

// http://stackoverflow.com/questions/2961964/how-to-re-enable-the-context-menu-in-this-case
	document.superListener = document.addEventListener;
	document.addEventListener = function(type, listener, useCapture){
		if (type !== 'contextmenu') {
			document.superListener(type, listener, !!useCapture);
		}	
	};	
/*		

*/	
	var sheet = document.createElement('style');
	document.body.appendChild(sheet);
	sheet.innerHTML = 'a {color: #fff;}';
	
	var info = document.createElement( 'div' );
	document.body.appendChild( info );
	info.style.top = '0px';
	info.style.color = '#fff';
	info.style.padding = '5px';
	info.style.position = 'absolute';
	info.style.width = '100%';
	info.innerHTML = '<a href="JavaScript:showSlide(\'long-walk\')">Long Walk</a>' +
	' ~ <a href="JavaScript:showSlide(\'fireworks\')">FireWorks</a>' +
	' ~ <a href="JavaScript:showSlide(\'text3d\')">Text 3D</a>' +
	' ~ <a href="JavaScript:showHome()">Home</a>' +
	' ~ <a href="JavaScript:noErase()">no Erase</a>';
	// var audioElement = document.createElement('audio');
	
    var scene, camera, controls, stats, renderer;
    var texture, material, geometry, mesh;
	
	var loader = new THREE.JSONLoader();
	var clock = new THREE.Clock();
	var parent, child;
	var delta;
	var erase = true;
	
    init();
    animate();
	function callback() {}
	
    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.set(30, 30, 30);
		controls = new THREE.TrackballControls( camera );
		controls.target.set( 0, 0, 0); 
		scene.add( camera );
		
		light = new THREE.AmbientLight( 0x444444 );
		scene.add( light );

		light = new THREE.DirectionalLight( 0xffffff, 0.5);
		//light.position.set( 100, 100, 100 ).normalize();
		light.position.set( -1, 1, 1 );
		scene.add( light );	
		
		light = new THREE.SpotLight( 0xffffff, 1 );
		light.position.set( 0, 10, -10 ); // too close = clipping, too far = pixelated
		light.castShadow = true;
		light.shadowCameraNear = camera.near;
		light.shadowCameraFar = camera.far;
		light.shadowCameraFov = 70;
		// light.shadowBias = -0.00022;          // adjust bias to remove artifacts (can be tricky, so I've heard)
		// light.shadowDarkness = 0.5;
		light.shadowMapWidth = 1024;
		light.shadowMapHeight = 1024;
		// light.shadowCameraVisible = true;
		scene.add( light );	
	
		parent = new THREE.Object3D();
		scene.add( parent );
				
		material = new THREE.MeshNormalMaterial( { wireframe: true } );
		geometry = new THREE.PlaneGeometry( 200, 200, 100, 100 );		
		mesh = new THREE.Mesh( geometry, material );
		parent.add( mesh );
				
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		stats.domElement.style.zIndex = 100;
		document.body.appendChild( stats.domElement );		

        renderer = new THREE.WebGLRenderer( {clearColor: 0x000000, clearAlpha: 1, antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
		renderer.shadowMapEnabled = true;
		
		document.addEventListener( 'keydown', onKeyDown, false );
		document.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);
		document.addEventListener('mousewheel', onDocumentMouseWheel, false);		
    }
	
    function animate() {
        requestAnimationFrame( animate );
        render();
		stats.update();
    }

    function render() {	
		delta = clock.getDelta();
		callback();
		controls.update( delta );		
		renderer.render( scene, camera );
    }
	
	function showSlide(fileName) {
		var fname = fileName + '/' + fileName + '.js';
		scene.remove( child );
		child  = new THREE.Object3D();
		scene.add( child );
		
		var js = document.createElement('script');
		js.setAttribute('type', 'text/javascript');
		js.setAttribute('src', fname);
		document.body.appendChild(js);
	}
	
	function showHome() {
		camera.position.set(10, 10, 10);
		camera.up.set(0,1,0);
		controls.target.set( 0, 0, 0); 
	}
	
	function noErase() {
		if (erase) {
			erase = false;
		} else {
			erase = true;
		}
	}
	
	function addText (asset, text, x, y, z, siz, col, amb) {	
		// material = new THREE.MeshPhongMaterial( { ambient: 0xff0000, color: 0x0000ff, specular: 0x0000ff, shininess: 50, shading: THREE.SmoothShading }  );
		material = new THREE.MeshPhongMaterial( { color: col, specular: 0xffffff, ambient: amb } );
		geometry = new THREE.TextGeometry( text, {
			size: siz,
			height: 15,
			font: "helvetiker",
			weight: "bold",
			bevelThickness: 2,
			bevelSize: 2,
			bevelEnabled: true
		});		
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( x, y, z);
		asset.add( mesh );
	}

	function onKeyDown ( event ) {
// http://www.webonweboff.com/tips/js/event_key_codes.aspx
		switch( event.keyCode ) {
			case 49: /*1*/	showSlide(1); break;
			case 50: /*2*/	showSlide(2); break;
			case 51: /*3*/	showSlide(3); break;
			case 72: /*h*/	showHome(); break;
			case 78: /*e*/	noErase(); break;
		}
	}
	
	function onDocumentMouseWheel(e) {
		var d = ( (typeof e.wheelDelta !== "undefined") ? (-e.wheelDelta) : e.detail );
		d = 5 * ( ( d > 0) ? 1 : -1 );

		var cPos = camera.position;
		if (isNaN(cPos.x) || isNaN(cPos.y) || isNaN(cPos.y)) {
			return;
		}  

		var r = cPos.x * cPos.x + cPos.y * cPos.y;
		var sqr = Math.sqrt(r);
		var sqrZ = Math.sqrt(cPos.z * cPos.z + r);

		var nx = cPos.x + ((r===0) ? 0 : (d * cPos.x / sqr));
		var ny = cPos.y + ((r===0) ? 0 : (d * cPos.y / sqr));
		var nz = cPos.z + ((sqrZ===0) ? 0 : (d * cPos.z / sqrZ));

		if (isNaN(nx) || isNaN(ny) || isNaN(nz)) {
			return;
		}  
		cPos.x = nx;
		cPos.y = ny;
		cPos.z = nz;     
	}	
