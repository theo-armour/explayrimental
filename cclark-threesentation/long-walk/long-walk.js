/*

Remember to empty the cache - after every save...

*/

	function showHome() {
		camera.up.set( 0, 1, 0);
		camera.position.set( 5, 10, -5);
		controls.target.set( 0, 3, 0); 
	}
	
	showHome();

	audioElement.src = 'long-walk/Analog_Boys_2.WAV';
	audioElement.loop = 'True';
	audioElement.play();
	
scene.fog = new THREE.Fog( 0x000000, 1, 50);
	light = new THREE.AmbientLight( 0xbbbbbb );
	child.add( light );
	
	light = new THREE.PointLight( 0xff4400, 5, 30 );
	light.position.set( 5, 5, 0 );
	child.add( light );
	
	light = new THREE.PointLight( 0xff4400, 5, 30 );
	light.position.set( -5, 5, 0 );
	child.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 1);
	//light.position.set( 100, 100, 100 ).normalize();
	light.position.set( -1, 1, 1 ).normalize();
	// scene.add( light );		
	
	light = new THREE.SpotLight( 0xffffff, 2 );
	light.position.set( 0, 10, 10 ); // too close = clipping, too far = pixelated
	light.castShadow = true;
	light.shadowCameraNear = camera.near;
	light.shadowCameraFar = camera.far;
	light.shadowCameraFov = 70;
	// light.shadowBias = -0.00022;          // adjust bias to remove artifacts (can be tricky, so I've heard)
	// light.shadowDarkness = 0.5;
	light.shadowMapWidth = 1024;
	light.shadowMapHeight = 1024;
	// light.shadowCameraVisible = true;
	child.add( light );	
		
	texture	= THREE.ImageUtils.loadTexture( "long-walk/water.jpg" );
	texture.wrapT = THREE.RepeatWrapping;
		material = new THREE.MeshPhongMaterial( { color: 0xffdd99, map : texture } );
		THREE.ColorUtils.adjustHSL( material.color, 0, 0, 0.9 );
		material.ambient = material.color;
			
	geometry = new THREE.CubeGeometry( 80, 10, 80 );
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.y = -5;
	// mesh.castShadow = false;
	mesh.receiveShadow = true;
	child.add( mesh );
	
	loader.load( "cclark.js", function ( geometry ) {
		material = new THREE.MeshPhongMaterial( { ambient: 0x888888, color: 0xff0000, specular: 0x888888, shininess: 20, opacity: 0.8 }  );
		mesh = new THREE.MorphAnimMesh( geometry, material );
		mesh.position.set(3, 5, -5);
		mesh.scale.set(0.5, 0.5, 0.5);
		mesh.rotation.set(0, 0, 0);
		mesh.castShadow = true;
		child.add( mesh );
	} );
	
	var meshes = [];
	//var mmaterial;
	loader.load( "long-walk/walkingCycleMedium.js", function ( geometry ) {
		material = geometry.materials[ 0 ];
		material.morphTargets = true;
		material.color.setHex( 0xaaaaff ); // brightens them a bit
		material.ambient.setHex( 0x222222 );
			//material.map.offset.x = 0.5 * Math.random();
			// material.map.offset.y = 0.5 * Math.random();		
		material = new THREE.MeshFaceMaterial();
		for ( var i = 0; i < 3; i++ ) {

			mesh = new THREE.MorphAnimMesh( geometry, material );
			mesh.geometry.materials[0].map.offset.x += 500 * Math.random();
			mesh.geometry.materials[0].map.offset.y += 500 * Math.random();
			// one second duration				
			mesh.duration = 1000;
			// random animation offset
			mesh.time = 1000 * Math.random();
			mesh.position.set( 2 * i, 0, 2 * i );
			mesh.rotation.y = Math.PI + THREE.Math.randFloat( -0.25, 0.25 );
			mesh.castShadow = true;
			mesh.matrixAutoUpdate = false;
			mesh.updateMatrix();
			child.add( mesh );
			meshes.push( mesh );
		}
	} );
		
	function callback() {
		if ( meshes.length ) {
			for ( i = 0; i < meshes.length; i ++ ) {
				meshes[ i ].updateAnimation( 800 * delta );
				meshes[ i ].geometry.materials[0].map.offset.x -= 0.001 * Math.random();
				meshes[ i ].geometry.materials[0].map.offset.y -= 0.001 * Math.random();
			}	
		}
		texture.offset.y -= 0.002;
		texture.offset.y %= 1;
		texture.needsUpdate	= true;
		var tim = clock.elapsedTime;
		if (!mouseDown) {
			camera.position.x += 0.025 * Math.cos( tim * 0.15);
			camera.position.z += 0.025 * Math.sin( tim * 0.15);
// console.log( tim, camera.position.x, camera.position.z );			
		}		
		controls.target.set( 0, 3, 0 );
	}
	

		
