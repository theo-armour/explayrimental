/*

Clear cache after eac edit

*/

	var vertexShaderSourceString = 
	'attribute float size;	\
	attribute vec3 pcolor;	\
	varying vec3 vColor;	\
	void main() {	\
		vColor = pcolor;	\
		vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );	\
		gl_PointSize = size * ( 200.0 / length( mvPosition.xyz ) );	\
		gl_Position = projectionMatrix * mvPosition;	\
	}	\
	' ;

	var fragmentShaderSourceString =
	'uniform sampler2D texture;	\
	varying vec3 vColor;	\
	void main() {	\
		vec4 outColor = texture2D( texture, gl_PointCoord );	\
		gl_FragColor = outColor * vec4( vColor, 1.0 );	\
	}	\
	' ;
	
	if (erase) { scene.remove(previousChild); }	
	
	camera.position.set( 0, 5, 100 );
	camera.lookAt( center );
	var pointLight;
	var text, plane;
	var speed = 50;
	var targetRotation = 0;
	var targetRotationOnMouseDown = 0;
	var mouseX = 0;
	var mouseXOnMouseDown = 0;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var deltaFW = 1;
	var ccgShape, particleCloud, sparksEmitter, emitterPos;
	var _rotation = 0;
	var timeOnShapePath = 0;
	var composer;

	child  = new THREE.Object3D();	
	scene.add( child );	
	
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 0, -1, 1 );
	directionalLight.position.normalize();
	child.add( directionalLight );

	pointLight = new THREE.PointLight( 0xffffff, 2, 300 );
	pointLight.position.set( 0, 0, 80 );
	child.add( pointLight );

	// material = new THREE.MeshNormalMaterial();
	//material = new THREE.MeshPhongMaterial( { ambient: 0xaaaaaa, color: 0x888888, specular: 0x00ff00, shininess: 50, opacity: 0.6 }  );
	//material = new THREE.MeshPhongMaterial( { ambient: 0xff0000, color: 0x0000ff, specular: 0x00ff00, shininess: 50, shading: THREE.SmoothShading }  );
	material= new THREE.MeshBasicMaterial( { color: 0xffffff, shading: THREE.SmoothShading, opacity: 0.95 } );
	geometry = new THREE.SphereGeometry( 20, 20, 20 );
	
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.set(0, 0, 0);
	child.add( mesh );	
	
	//var loader = new THREE.JSONLoader();
	loader.load( "cclark.js", function ( geometry ) {
		// material = new THREE.MeshPhongMaterial( { ambient: 0xaaaaaa, color: 0x888888, specular: 0x00ff00, shininess: 50, opacity: 0.6 }  );
		material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, opacity: 0.95 } );
		mesh = new THREE.MorphAnimMesh( geometry, material );
		
		/// this is the issue nost likely
		// mesh = new THREE.MeshFaceMaterial( geometry, material );
		mesh.position.set(0, -5, 0);
		mesh.scale.set(10, 10, 10);
		mesh.rotation.set( 0, 0, 0);
		// mesh.castShadow = true;
		child.add( mesh );
		// scene.add( parent );
	} );
			
	///// Create particle objects for Three.js
	var particlesLength = 70000;
	var particles = new THREE.Geometry();
	function newpos( x, y, z ) {
		// return new THREE.Vertex( new THREE.Vector3( x, y, z ) );
		return new THREE.Vector3( x, y, z );
	}

	var Pool = {
		__pools: [],
		// Get a new Vector
		get: function() {
			if ( this.__pools.length > 0 ) {
				return this.__pools.pop();
			}
			console.log( "pool ran out!" )
			return null;
		},
		// Release a vector back into the pool
		add: function( v ) {
			this.__pools.push( v );
		}
	};

	for ( i = 0; i < particlesLength; i ++ ) {
		particles.vertices.push( newpos( Math.random() * 200 - 100, Math.random() * 100 + 150, Math.random() * 50 ) );
		Pool.add( i );
	}

	// Create pools of vectors
	attributes = {
		size:  { type: 'f', value: [] },
		pcolor: { type: 'c', value: [] }
	};
	var sprite = generateSprite() ;
	texture = new THREE.Texture( sprite );
	texture.needsUpdate = true;
	uniforms = {
		texture:   { type: "t", value: 0, texture: texture }
	};
	
	// PARAMETERS
	// Steadycounter
	// Life
	// Opacity
	// Hue Speed
	// Movement Speed
	function generateSprite() {
		var canvas = document.createElement( 'canvas' );
		canvas.width = 128;
		canvas.height = 128;
		var context = canvas.getContext( '2d' );
/*
		// Just a square, doesnt work too bad with blur pp.
		context.fillStyle = "white";
		context.strokeStyle = "white";
		context.fillRect(0, 0, 63, 63) ;
		// Heart Shapes are not too pretty here
		var x = 4, y = 0;
		context.save();
		context.scale(8, 8); // Scale so canvas render can redraw within bounds
		context.beginPath();
		context.bezierCurveTo( x + 2.5, y + 2.5, x + 2.0, y, x, y );
		context.bezierCurveTo( x - 3.0, y, x - 3.0, y + 3.5,x - 3.0,y + 3.5 );
		context.bezierCurveTo( x - 3.0, y + 5.5, x - 1.0, y + 7.7, x + 2.5, y + 9.5 );
		context.bezierCurveTo( x + 6.0, y + 7.7, x + 8.0, y + 5.5, x + 8.0, y + 3.5 );
		context.bezierCurveTo( x + 8.0, y + 3.5, x + 8.0, y, x + 5.0, y );
		context.bezierCurveTo( x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5 );
		context.closePath();
*/				
		context.beginPath();
		context.arc( 64, 64, 60, 0, Math.PI * 2, false) ;
		context.closePath();
		
		context.lineWidth = 0.5; //0.05
		context.stroke();
		context.restore();
		var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
		gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
		gradient.addColorStop( 0.2, 'rgba(255,255,255,1)' );
		gradient.addColorStop( 0.4, 'rgba(200,200,200,1)' );
		gradient.addColorStop( 1, 'rgba(0,0,0,1)' );
		context.fillStyle = gradient;
		context.fill();
		return canvas;
	}

	var shaderMaterial = new THREE.ShaderMaterial( {
		uniforms: 		uniforms,
		attributes:     attributes,
		vertexShader:   vertexShaderSourceString,
		fragmentShader: fragmentShaderSourceString,
		blending: 		THREE.AdditiveBlending,
		depthWrite:		false,
		transparent:	true
	});
	particleCloud = new THREE.ParticleSystem( particles, shaderMaterial );
	particleCloud.dynamic = true;
	//particleCloud.sortParticles = true;
	var vertices = particleCloud.geometry.vertices;
	var values_size = attributes.size.value;
	var values_color = attributes.pcolor.value;
	for( var v = 0; v < vertices.length; v ++ ) {
		values_size[ v ] = 50;
		values_color[ v ] = new THREE.Color( 0xffffff );
		values_color[ v ].setHSV( 0, 0, 0 );
		particles.vertices[ v ].set( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );
	}
	// parent.add( particleCloud );
	child.add( particleCloud );
	
	particleCloud.y = 800;

	// Create Particle Systems
	// EMITTER STUFF
	// Heart
	var x = 0, y = 0;
	ccgShape = new THREE.Shape();
				
/*
	ccgShape.moveTo( x + 25, y + 25 );
	ccgShape.bezierCurveTo( x + 25, y + 25, x + 20, y, x, y );
	ccgShape.bezierCurveTo( x - 30, y, x - 30, y + 35,x - 30,y + 35 );
	ccgShape.bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 );
	ccgShape.bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 );
	ccgShape.bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y );
	ccgShape.bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 );
*/				
				
	ccgShape.moveTo( x - 60, y + 20);
	ccgShape.bezierCurveTo( x - 60, y + 20, x - 40, y + 0, x + 10, y + 10 );
	ccgShape.bezierCurveTo( x + 0, y + 30, x - 50, y + 50, x - 60, y + 80);
	// ccgShape.moveTo( x - 60, y + 80);
	ccgShape.bezierCurveTo( x - 60, y + 80, x + 40, y + 80, x + 0, y + 80);
	
	ccgShape.moveTo( x + 60, y + 20);
	ccgShape.bezierCurveTo( x + 60, y + 20, x + 70, y + 10, x + 75, y + 0 );
	ccgShape.bezierCurveTo( x + 80, y + 10, x + 80, y + 40, x + 80, y + 80);

	//ccgShape.moveTo( x - 20, y + 0);
	//ccgShape.bezierCurveTo( x - 20, y + 0, x + 50, y + 50, x + 100, y + 100 );				
	
	var hue = 0;
	var setTargetParticle = function() {
		var target = Pool.get();
		values_size[ target ] = Math.random() * 200 + 100;
		return target;
	};
				
	var onParticleCreated = function( p ) {
		var position = p.position;
		p.target.position = position;
		var target = p.target;
		if ( target ) {
			//console.log(target,particles.vertices[target]);
			//values_size[target]
			//values_color[target]
			hue += 0.0003 * deltaFW;
			if ( hue > 1 ) hue -= 1;
			// TODO Create a PointOnShape Action/Zone in the particle engine
			timeOnShapePath += 0.00035 * deltaFW;
			if ( timeOnShapePath > 1 ) timeOnShapePath -= 1;
			var pointOnShape = ccgShape.getPointAt( timeOnShapePath );
			emitterpos.x = pointOnShape.x * 1 - 0; // size + x position
			emitterpos.y = -pointOnShape.y * 1 + 50;
			//pointLight.position.copy( emitterpos );
			pointLight.position.x = emitterpos.x;
			pointLight.position.y = emitterpos.y;
			pointLight.position.z = -100;
			particles.vertices[ target ] = p.position;
			values_color[ target ].setHSV( hue, 0.8, 0.15 );
			pointLight.color.setHSV( hue, 0.8, 0.95 );

		};
	};
	var onParticleDead = function( particle ) {
		var target = particle.target;
		if ( target ) {
			// Hide the particle
			values_color[ target ].setHSV( 0, 0, 0 );
			particles.vertices[ target ].set( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );
			// Mark particle system as available by returning to pool
			Pool.add( particle.target );
		}
	};
	var engineLoopUpdate = function() {
	};

	sparksEmitter = new SPARKS.Emitter( new SPARKS.SteadyCounter( 500 ) );
	emitterpos = new THREE.Vector3( 0, 0, 0 );  // <<<< basic z position
	sparksEmitter.addInitializer( new SPARKS.Position( new SPARKS.PointZone( emitterpos ) ) );
	sparksEmitter.addInitializer( new SPARKS.Lifetime( 1, 15 ));
	sparksEmitter.addInitializer( new SPARKS.Target( null, setTargetParticle ) );

	sparksEmitter.addInitializer( new SPARKS.Velocity( new SPARKS.PointZone( new THREE.Vector3( 0, -5, 1 ) ) ) );
	// TOTRY Set velocity to move away from centroid
	sparksEmitter.addAction( new SPARKS.Age() );
	sparksEmitter.addAction( new SPARKS.Accelerate( 0, 0, 100 ) );
	sparksEmitter.addAction( new SPARKS.Move() );
	sparksEmitter.addAction( new SPARKS.RandomDrift( 90, 100, 2000 ) );

	sparksEmitter.addCallback( "created", onParticleCreated );
	sparksEmitter.addCallback( "dead", onParticleDead );
	sparksEmitter.start();
	
	//sparksEmitter.addCallback("loopUpdated", engineLoopUpdate);
	//sparksEmitter.addCallback("updated", function(p) {
		// var target = particle.target;
		// 					if (target) {
		// 						// update energy properties
		// 						//values_size[target] = Math.random()*100;
		// 					}
	//});
	//
	// End Particles

// POST PROCESSING
	var effectFocus = new THREE.ShaderPass( THREE.ShaderExtras[ "focus" ] );
	var effectScreen = new THREE.ShaderPass( THREE.ShaderExtras[ "screen" ] );
	effectFilm = new THREE.FilmPass( 0.5, 0.25, 2048, false );
	var shaderBlur = THREE.ShaderExtras[ "triangleBlur" ];
	var effectBlurX = new THREE.ShaderPass( shaderBlur, 'texture' );
	var effectBlurY = new THREE.ShaderPass( shaderBlur, 'texture' );
	var radius = 15;
	var blurAmountX = radius / window.innerWidth;
	var blurAmountY = radius / window.innerHeight;
	var hblur = new THREE.ShaderPass( THREE.ShaderExtras[ "horizontalBlur" ] );
	var vblur = new THREE.ShaderPass( THREE.ShaderExtras[ "verticalBlur" ] );
	hblur.uniforms[ 'h' ].value =  1 / window.innerWidth;
	vblur.uniforms[ 'v' ].value =  1 / window.innerHeight;
	effectBlurX.uniforms[ 'delta' ].value = new THREE.Vector2( blurAmountX, 0 );
	effectBlurY.uniforms[ 'delta' ].value = new THREE.Vector2( 0, blurAmountY );
	effectFocus.uniforms[ 'sampleDistance' ].value = 0.99; //0.94
	effectFocus.uniforms[ 'waveFactor' ].value = 0.003;  //0.00125
	
	var renderScene = new THREE.RenderPass( scene, camera );
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( renderScene );
	composer.addPass( hblur );
	composer.addPass( vblur );
	//composer.addPass( effectBlurX );
	//composer.addPass( effectBlurY );
	//composer.addPass( effectScreen );
	//composer.addPass( effectFocus );
	//composer.addPass( effectFilm );
	vblur.renderToScreen = true;
	effectBlurY.renderToScreen = true;
	effectFocus.renderToScreen = true;
	effectScreen.renderToScreen = true;
	effectFilm.renderToScreen = true;
	//document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	//document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	//document.addEventListener( 'touchmove', onDocumentTouchMove, false );
//
			
	function callback() {
	
		deltaFW = speed * clock.getDelta();
		if (deltaFW < 0.5) {deltaFW = 0.5;}
		// particleCloud.geometry.__dirtyVertices = true;
		particleCloud.geometry.verticesNeedUpdate = true;
		attributes.size.needsUpdate = true;
		attributes.pcolor.needsUpdate = true;
		// Pretty cool effect if you enable this
		// particleCloud.rotation.y += 0.05;
		// child.rotation.y += ( targetRotation - child.rotation.y ) * 0.05;
		//renderer.clear();
		if (composer) {
			composer.render( 0.1 );
		}

	}	
	