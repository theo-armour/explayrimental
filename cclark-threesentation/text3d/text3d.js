/*

Empty the chache

*/	

	function showHome() {
		camera.up.set( 0, 1, 0);
		camera.position.set( 0, -5, 50);
		controls.target.set( 0, 12, 0); 
	}	
	
	showHome();
	
	audioElement.src = 'text3d/typing_on_a_manual_typewriter.mp3';
	audioElement.loop = 'True';
	audioElement.play();
	
	scene.fog = new THREE.Fog( 0x000000, 1, 150);
	
	//light.position.set( -10, 20, 20 );
	
	var pointLight;
	
	light = new THREE.AmbientLight( 0xffffff );
	child.add( light );
	
	light = new THREE.PointLight( 0xff4400, 20 );
	light.position.set( 50, 5, 90 );
	child.add( light );
	
	light = new THREE.PointLight( 0xff4400, 5 );
	light.position.set( -50, 5, 90 );
	child.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 5);
	light.position.set( -100, 100, 100 );
	// light.position.set( -1, 1, 1 ).normalize();
	// child.add( light );		
	
	light = new THREE.SpotLight( 0xffffff );
	light.position.set( 0, 10, 50 ); // too close = clipping, too far = pixelated
	// light.castShadow = true;
	light.shadowCameraNear = camera.near;
	light.shadowCameraFar = camera.far;
	light.shadowCameraFov = 100;
	// light.shadowBias = -0.00022;          // adjust bias to remove artifacts (can be tricky, so I've heard)
	// light.shadowDarkness = 0.5;
	//light.shadowMapWidth = 1024;
	//light.shadowMapHeight = 1024;
	light.shadowCameraVisible = true;
	child.add( light );	
	
	// material = new THREE.MeshPhongMaterial( { ambient: 0xaaaaaa, color: 0xaaaaaa, specular: 0xaaaaaa, shininess: 50, opacity: 0.8 }  );	
	material = new THREE.MeshPhongMaterial( { ambient: 0xff0000, color: 0x0000ff, specular: 0x00ff00, shininess: 50, opacity: 0.8 }  );
	geometry = new THREE.PlaneGeometry( 300, 330, 1, 1 );

	mesh = new THREE.Mesh( geometry, material );
	mesh.doubleSided = true;
	mesh.position.set(0, 40, 0)
	child.add( mesh );
	
	mesh = new THREE.Mesh( geometry, material );
	mesh.doubleSided = true;
	mesh.position.set(0, -20, 0)
	child.add( mesh );

	// material = new THREE.MeshNormalMaterial();
	material = new THREE.MeshPhongMaterial( { ambient: 0xff0000, color: 0x0000ff, specular: 0x00ff00, shininess: 50, opacity: 0.8 }  );	
	
	var artists = ['Chester Arnold','Ray Beldner','Sandow Birk','Adam Chapman','Timothy Cummings','Andy Diaz Hope','Anthony Discenza','Chris Doyle','Christoph Draeger','Al Farrow','Kate Gilmore','Ken Goldberg','Scott Greene','Charles Gute','Julie Heffernan','Packard Jennings','Nina Katchadourian','Ellen Kooi','leonardogillesfleur','Ligorano/Reese','Kara Maria','Kambui Olujimi','Ed Osborn','Walter Robinson','Alexis Rockman','Carlos & Jason Sanchez','Lincoln Schatz','John Slepian','Jonathan Solo','Travis Somerville','Stephanie Syjuco','Josephine Taylor','Masami Teraoka'];
	var meshes = [];
	for (var i = 0; i < artists.length; i++) {
		temp = new THREE.TextGeometry( artists[i], { size: 5, height: 2, curveSegments: 3,
			font: "helvetiker", 
			weight: "bold",
		});		
		mesh = new THREE.Mesh( temp, material );
		mesh.position.set(Math.random() * 250 - 120, Math.random() * 50 - 20, Math.random() * 100 - 50);
		// mesh.receiveShadow = true;
		mesh.castShadow = true;
		meshes.push(mesh);
		child.add( mesh );
	}
	
	loader.load( 'text3d/cclark.js', callBackCC );
	
	function callBackCC(geometry) {
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(0, -10, 0);
		mesh.scale.set(10, 10, 10);
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		child.add( mesh );
		animate();
	}		
			
	function callback() {
		for (var i = 0; i < meshes.length; i++) {
			meshes[i].position.x -= 0.4;
			if (meshes[i].position.x < -120) { 
				meshes[i].position.set( 120, Math.random() * 50 - 20, Math.random() * 100 - 70 );
			}
		}
		
		var tim = clock.elapsedTime;
		if (!mouseDown) {
			var x = 0.05 * Math.cos( tim * 0.15);
			camera.position.x += x;
			camera.position.y += 0.02 * Math.sin( tim * 0.1);
			// camera.position.x += 0.025 * Math.cos( tim * 0.15);
			// camera.position.z += 0.025 * Math.sin( tim * 0.15);
// console.log( tim, camera.position.x, camera.position.y, camera.position.z );			
		}	
	}	