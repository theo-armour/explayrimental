/*

Empty the chache

*/	

	if (erase) { scene.remove(previousChild); }	
	child  = new THREE.Object3D();	
	scene.add( child );	
	
	camera.position.set( 0, 5, 100 );
	camera.position.set(-50, -20, 50);
	camera.lookAt( center );
	
	var text3d, thing1, theText;
	meshes = [];
	
		material = new THREE.MeshPhongMaterial( { ambient: 0xff0000, color: 0x0000ff, specular: 0x00ff00, shininess: 50, opacity: 0.8 }  );
		
		geometry = new THREE.PlaneGeometry( 300, 330, 1, 1 );

		mesh = new THREE.Mesh( geometry, material );
		mesh.doubleSided = true;
		//mesh.rotation.x = - Math.PI / 2;
		mesh.position.set(0, 40, 0)
		child.add( mesh );
		
		mesh = new THREE.Mesh( geometry, material );
		mesh.doubleSided = true;
		// mesh.rotation.x = - Math.PI / 2;
		mesh.position.set(0, -20, 0)
		child.add( mesh );

		// loader = new THREE.JSONLoader();
		loader.load( 'text3d/cclark.js', callBackCC );
		
		material = new THREE.MeshNormalMaterial();	
		
		var artists = ['Chester Arnold','Ray Beldner','Sandow Birk','Adam Chapman','Timothy Cummings','Andy Diaz Hope','Anthony Discenza','Chris Doyle','Christoph Draeger','Al Farrow','Kate Gilmore','Ken Goldberg','Scott Greene','Charles Gute','Julie Heffernan','Packard Jennings','Nina Katchadourian','Ellen Kooi','leonardogillesfleur','Ligorano/Reese','Kara Maria','Kambui Olujimi','Ed Osborn','Walter Robinson','Alexis Rockman','Carlos & Jason Sanchez','Lincoln Schatz','John Slepian','Jonathan Solo','Travis Somerville','Stephanie Syjuco','Josephine Taylor','Masami Teraoka'];
		
		for (var i = 0; i < artists.length; i++) {
			temp = new THREE.TextGeometry( artists[i], { size: 1, height: 0.5, curveSegments: 3,
				font: "helvetiker", 
				weight: "bold",
			});		
			mesh = new THREE.Mesh( temp, material );
			mesh.scale.set(10, 10, 10);
			mesh.position.set(Math.random() * 40 - 20, Math.random() * 50 - 20, Math.random() * 100 - 70);
			meshes.push(mesh);
			child.add( mesh );
		}		
		
	function callBackCC(geometry) {
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(0, -10, 0);
		mesh.scale.set(10, 10, 10);
		child.add( mesh );
		animate();
	}		
			
	function callback() {
		for (var i = 0; i < meshes.length; i++) {
			meshes[i].position.x -= 0.1;
			if (meshes[i].position.x < -20) { meshes[i].position.x = 20;}
		}

	}	
