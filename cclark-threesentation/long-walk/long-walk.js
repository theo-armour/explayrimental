/*

Remember to empty the cache - after every save...

*/
	child  = new THREE.Object3D();
	
	texture	= THREE.ImageUtils.loadTexture( "long-walk/water.jpg" );
	texture.wrapT = THREE.RepeatWrapping;
	material = new THREE.MeshPhongMaterial( { color: 0xffdd99, map : texture } );
	THREE.ColorUtils.adjustHSV( material.color, 0, 0, 0.9 );
	material.ambient = material.color;
			
	geometry = new THREE.CubeGeometry( 100, 10, 100 );
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.y = -5;
	mesh.castShadow = false;
	mesh.receiveShadow = true;
	child.add( mesh );
	
	loader.load( "cclark.js", function ( geometry ) {
		material = new THREE.MeshPhongMaterial( { ambient: 0x888888, color: 0x888888, specular: 0x888888, shininess: 20, opacity: 0.8 }  );
		mesh = new THREE.MorphAnimMesh( geometry, material );
		mesh.position.set(3, 5, -5);
		mesh.scale.set(0.5, 0.5, 0.5);
		mesh.rotation.set(0, 0, 0);
		mesh.castShadow = true;
		child.add( mesh );
	} );
	
	
	meshes = [];
	loader.load( "long-walk/walkingCycleMedium.js", function ( geometry ) {
		material = geometry.materials[ 0 ];
		material.morphTargets = true;
		material.color.setHex( 0xaaaaff ); // brightens them a bit
		material.ambient.setHex( 0x222222 );
		material = new THREE.MeshFaceMaterial();
		for ( var i = 0; i < 3; i ++ ) {
			mesh = new THREE.MorphAnimMesh( geometry, material );
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
		
	scene.add( child);	
	if (erase) { scene.remove(previousChild); }
	
	function callback() {
		if ( meshes.length ) {
			for ( var i = 0; i < meshes.length; i ++ )
				meshes[ i ].updateAnimation( 1000 * delta );
		}
		texture.offset.y	-= 0.002;
		texture.offset.y	%= 1;
		texture.needsUpdate	= true;
		var timer = Date.now() * 0.0002;
		camera.position.x = Math.cos( timer ) * 10;
		camera.position.y = 10;
		camera.position.z = Math.sin( timer ) * 10;
		camera.lookAt( center );
	}
		
