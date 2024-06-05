//import * as THREE from '../node_modules/three/build/three.module.js';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj;
        this.minProp = minProp;
        this.maxProp = maxProp;
        this.minDif = minDif;
    }
    get min() {
        return this.obj[this.minProp];
    }
    set min(v) {
        this.obj[this.minProp] = v;
        this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
        return this.obj[this.maxProp];
    }
    set max(v) {
        this.obj[this.maxProp] = v;
        this.min = this.min;  // this will call the min setter
    }
}

function updateCamera() {
    camera.updateProjectionMatrix();
}

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer( {antialias: true, canvas} );

    const fov = 40;
    const aspect = 2;
    const near = 0.1;
    const far = 40;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set( 0, 3, 22 );

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 3, 0);
    controls.update();
    const scene = new THREE.Scene();
    const shapes = [];

    const mat_white = new THREE.MeshStandardMaterial( {color: 0xffffff, roughness: 0.5} );
    const mat_black = new THREE.MeshStandardMaterial( {color: 0x454E57, roughness: 0.5} );

    // LIGHT SOURCE

    // Directional
    const color = 0xFFFFFF;
    const intensity = 0.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // Ambient

    const color_a = 0xFFFFFF;
    const intensity_a = 0.09; // 0.03 original
    const light_ambient = new THREE.AmbientLight(color_a, intensity_a);
    scene.add(light_ambient);

    // Headlight

    const color_h = 0xFFF5D5;
    const intensity_h = 100;
    const light_headlight = new THREE.SpotLight(color_h, intensity_h, 100, 10, 0.4);
    light_headlight.position.set(0.26, 1.225, -0.9);
    light_headlight.target.position.set(-100, 1, -1);

    scene.add(light_headlight);
    scene.add(light_headlight.target);

    const helper = new THREE.SpotLightHelper(light_headlight);
    //scene.add(helper);


    // TEXTURES
    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);
    const skybox = loader.load(
        '../resources/images/Outside2.jpg', () => {
            skybox.mapping = THREE.EquirectangularReflectionMapping;
            skybox.colorSpace = THREE.SRGBColorSpace;
            scene.background = skybox;
        }
    )

    // LANDSCAPE
    const planeSize = 16;
    const chessboard = loader.load('../resources/images/Chessboard.jpg');
    chessboard.colorSpace = THREE.SRGBColorSpace;
    chessboard.wrapS = THREE.ClampToEdgeWrapping;
    chessboard.wrapT = THREE.ClampToEdgeWrapping;
    chessboard.magFilter = THREE.NearestFilter;
    //const repeats = planeSize / 2;
    //chessboard.repeat.set( repeats, repeats  );

    const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
    const planeMat = new THREE.MeshPhongMaterial( {
        map: chessboard,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh( planeGeo, planeMat );
    mesh.rotation.x = Math.PI * -.5;
    mesh.rotation.y = Math.PI;
    mesh.position.set(0, -0.01, 0);
    scene.add( mesh );

    // CUSTOM 3D OBJ
    const objLoader = new OBJLoader();
    objLoader.load('../resources/models/bench/Helmet.obj', (root) => {
        root.scale.set(0.08, 0.06, 0.04);
        root.position.set(0.85, 1, -1.3)
        root.rotation.x = -(Math.PI/2);
        root.rotation.z = -(Math.PI/2);
        root.traverse(node => {
            const material = new THREE.MeshStandardMaterial( {
                color: 0xFFA500,
                roughness: 0.25
            })
            if (material) {
                node.material = material;
            }
        }) 
        scene.add(root);
        // add material textures
    })

    // CHESS PIECES
    const crowns = []

    // ROOKS
    const geo_rook = new THREE.CylinderGeometry(0.4, 0.6, 1, 16);
    const geo_rook_head = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 8);

    const w_rook1 = new THREE.Mesh( geo_rook, mat_white);
    const w_rook1_head = new THREE.Mesh( geo_rook_head, mat_white);
    const w_rook2 = new THREE.Mesh( geo_rook, mat_white);
    const w_rook2_head = new THREE.Mesh( geo_rook_head, mat_white);
    const b_rook1 = new THREE.Mesh( geo_rook, mat_black);
    const b_rook1_head = new THREE.Mesh( geo_rook_head, mat_black);
    const b_rook2 = new THREE.Mesh( geo_rook, mat_black);
    const b_rook2_head = new THREE.Mesh( geo_rook_head, mat_black);


    w_rook1.position.set(7, 0.5, 7);
    w_rook1_head.position.set(7, 1, 7);
    w_rook2.position.set(7, 0.5, -7);
    w_rook2_head.position.set(7, 1, -7);
    b_rook1.position.set(-7, 0.5, 7);
    b_rook1_head.position.set(-7, 1, 7);
    b_rook2.position.set(-7, 0.5, -7);
    b_rook2_head.position.set(-7, 1, -7);

    shapes.push(w_rook1);
    shapes.push(w_rook1_head);
    shapes.push(w_rook2);
    shapes.push(w_rook2_head);
    shapes.push(b_rook1);
    shapes.push(b_rook1_head);
    shapes.push(b_rook2);
    shapes.push(b_rook2_head);

    // BISHOPS

    const geo_bishop = new THREE.CylinderGeometry(0.1, 0.6, 1, 16);
    const geo_bishop_head = new THREE.LatheGeometry();
    const w_bishop1 = new THREE.Mesh( geo_bishop, mat_white);
    const w_bishop1_head = new THREE.Mesh( geo_bishop_head, mat_white);
    const w_bishop2 = new THREE.Mesh( geo_bishop, mat_white);
    const w_bishop2_head = new THREE.Mesh( geo_bishop_head, mat_white);
    const b_bishop1 = new THREE.Mesh( geo_bishop, mat_black);
    const b_bishop1_head = new THREE.Mesh( geo_bishop_head, mat_black);
    const b_bishop2 = new THREE.Mesh( geo_bishop, mat_black);
    const b_bishop2_head = new THREE.Mesh( geo_bishop_head, mat_black);

    w_bishop1.add(w_bishop1_head)
    w_bishop2.add(w_bishop2_head)
    b_bishop1.add(b_bishop1_head)
    b_bishop2.add(b_bishop2_head)

    w_bishop1.position.set(7, 0.5, 3);
    w_bishop1_head.position.set(0, 0.5, 0);
    w_bishop2.position.set(7, 0.5, -3);
    w_bishop2_head.position.set(0, 0.5, 0);
    b_bishop1.position.set(-7, 0.5, 3);
    b_bishop1_head.position.set(0, 0.5, 0);
    b_bishop2.position.set(-7, 0.5, -3);
    b_bishop2_head.position.set(0, 0.5, 0);

    shapes.push(w_bishop1);
    shapes.push(w_bishop2);
    shapes.push(b_bishop1);
    shapes.push(b_bishop2);



    // KNIGHTS
    const geo_kn = new THREE.CylinderGeometry(0.3, 0.6, 1, 16);
    const geo_kn_h1 = new THREE.CapsuleGeometry(0.5, 0, 1, 8);
    const geo_kn_h2 = new THREE.CylinderGeometry(0.1, 0.2, 0.5, 16);


    const w_kn1 = new THREE.Mesh(geo_kn, mat_white);
    const w_kn1_h1 = new THREE.Mesh(geo_kn_h1, mat_white);
    const w_kn1_h2 = new THREE.Mesh(geo_kn_h2, mat_white);
    const w_kn2 = new THREE.Mesh(geo_kn, mat_white);
    const w_kn2_h1 = new THREE.Mesh(geo_kn_h1, mat_white);
    const w_kn2_h2 = new THREE.Mesh(geo_kn_h2, mat_white);

    const b_kn1 = new THREE.Mesh(geo_kn, mat_black);
    const b_kn1_h1 = new THREE.Mesh(geo_kn_h1, mat_black);
    const b_kn1_h2 = new THREE.Mesh(geo_kn_h2, mat_black);
    const b_kn2 = new THREE.Mesh(geo_kn, mat_black);
    const b_kn2_h1 = new THREE.Mesh(geo_kn_h1, mat_black);
    const b_kn2_h2 = new THREE.Mesh(geo_kn_h2, mat_black);
    
    w_kn1.add(w_kn1_h1);
    w_kn1.add(w_kn1_h2);
    w_kn2.add(w_kn2_h1);
    w_kn2.add(w_kn2_h2);

    b_kn1.add(b_kn1_h1);
    b_kn1.add(b_kn1_h2);
    b_kn2.add(b_kn2_h1);
    b_kn2.add(b_kn2_h2);


    w_kn1.position.set(7, 0.5, 5);
    w_kn1_h1.position.set(0, 0.5, 0);
    w_kn1_h2.rotateZ(Math.PI/2);
    w_kn1_h2.position.set(-0.5, 0.5, 0);

    w_kn2.position.set(7, 0.5, -5);
    w_kn2_h1.position.set(0, 0.5, 0);
    w_kn2_h2.rotateZ(Math.PI/2);
    w_kn2_h2.position.set(-0.5, 0.5, 0);

    b_kn1.position.set(-7, 0.5, 5);
    b_kn1_h1.position.set(0, 0.5, 0);
    b_kn1_h2.rotateZ(-Math.PI/2);
    b_kn1_h2.position.set(0.5, 0.5, 0);

    b_kn2.position.set(-7, 0.5, -5);
    b_kn2_h1.position.set(0, 0.5, 0);
    b_kn2_h2.rotateZ(-Math.PI/2);
    b_kn2_h2.position.set(0.5, 0.5, 0);

    shapes.push(w_kn1);
    shapes.push(w_kn2);
    shapes.push(b_kn1);
    shapes.push(b_kn2);

    // QUEENS
    const pearl = loader.load('../resources/images/Pearl.jpg');
    pearl.colorSpace = THREE.SRGBColorSpace;
    pearl.wrapS = pearl.wrapT = THREE.MirroredRepeatWrapping;
    pearl.magFilter = THREE.LinearFilter;

    const mat_pearl = new THREE.MeshStandardMaterial( {
        map: pearl,
        color: 0xFFFFFF,
        roughness: 0
    });

    const opal = loader.load('../resources/images/Opal.jpg');
    opal.colorSpace = THREE.SRGBColorSpace;
    opal.wrapS = opal.wrapT = THREE.MirroredRepeatWrapping;
    opal.magFilter = THREE.LinearFilter;

    const mat_opal = new THREE.MeshStandardMaterial( {
        map: opal,
        color: 0xFFFFFF,
        roughness: 0
    })

    const geo_queen = new THREE.CylinderGeometry(0.4, 0.7, 1.5, 16);
    const points = [];
    for ( let i = 0; i < 10; i ++ ) {
        points.push( new THREE.Vector2( Math.sin( i * 0.7 ) * 10 + 5, ( i - 5 ) * 2 ) );
    }
    const geo_queen_crown1 = new THREE.LatheGeometry(points);
    const geo_queen_crown2 = new THREE.OctahedronGeometry(0.45, 0);


    const w_queen = new THREE.Mesh(geo_queen, mat_white);
    const w_queen_crown1 = new THREE.Mesh(geo_queen_crown1, mat_white);
    const w_queen_crown2 = new THREE.Mesh(geo_queen_crown2, mat_pearl);
    const b_queen = new THREE.Mesh(geo_queen, mat_black);
    const b_queen_crown1 = new THREE.Mesh(geo_queen_crown1, mat_black);
    const b_queen_crown2 = new THREE.Mesh(geo_queen_crown2, mat_opal);

    w_queen_crown1.scale.setScalar(0.04);
    w_queen_crown2.scale.set(1, 0.8, 1);
    b_queen_crown1.scale.setScalar(0.04);
    b_queen_crown2.scale.set(1, 0.8, 1);        

    w_queen.add(w_queen_crown1);
    w_queen.add(w_queen_crown2);
    b_queen.add(b_queen_crown1);
    b_queen.add(b_queen_crown2);


    w_queen.position.set(7, 0.75, 1);
    w_queen_crown1.position.set(0, 0.6, 0);
    w_queen_crown2.position.set(0, 1.3, 0);

    b_queen.position.set(-7, 0.75, 1);
    b_queen_crown1.position.set(0, 0.6, 0);
    b_queen_crown2.position.set(0, 1.3, 0);

    crowns.push(w_queen_crown2);
    crowns.push(b_queen_crown2);

    shapes.push(w_queen);
    shapes.push(b_queen);

    // KINGS
    const geo_king = new THREE.CylinderGeometry(0.4, 0.7, 1.6, 16);
    const geo_king_crown2 = new THREE.IcosahedronGeometry(0.55, 0);
    const geo_king_crown3 = new THREE.TorusGeometry(0.6, 0.1, 8, 30);


    const w_king = new THREE.Mesh(geo_king, mat_white);
    const w_king_crown1 = new THREE.Mesh(geo_queen_crown1, mat_white);
    const w_king_crown2 = new THREE.Mesh(geo_king_crown2, mat_pearl);
    const w_king_crown3 = new THREE.Mesh(geo_king_crown3, mat_white);

    const b_king = new THREE.Mesh(geo_king, mat_black);
    const b_king_crown1 = new THREE.Mesh(geo_queen_crown1, mat_black);
    const b_king_crown2 = new THREE.Mesh(geo_king_crown2, mat_opal);
    const b_king_crown3 = new THREE.Mesh(geo_king_crown3, mat_black);

    w_king_crown1.scale.setScalar(0.04);
    w_king_crown2.scale.set(1, 0.5, 1);
    w_king_crown3.rotation.x = Math.PI * 0.5;

    b_king_crown1.scale.setScalar(0.04);
    b_king_crown2.scale.set(1, 0.5, 1);
    b_king_crown3.rotation.x = Math.PI * 0.5;

    w_king.add(w_king_crown1);
    w_king.add(w_king_crown2);
    w_king.add(w_king_crown3);

    b_king.add(b_king_crown1);
    b_king.add(b_king_crown2);
    b_king.add(b_king_crown3);


    w_king.position.set(7, 0.80, -1);
    w_king_crown1.position.set(0, 0.6, 0);
    w_king_crown2.position.set(0, 1.2, 0);
    w_king_crown3.position.set(0, 1.65, 0);

    b_king.position.set(-7, 0.80, -1);
    b_king_crown1.position.set(0, 0.6, 0);
    b_king_crown2.position.set(0, 1.2, 0);
    b_king_crown3.position.set(0, 1.65, 0);

    crowns.push(w_king_crown2); // anim
    crowns.push(b_king_crown2); // anim

    shapes.push(w_king);
    shapes.push(b_king);

    // Texture


    function q_animate(time) {
        time *= 0.001;
        crowns.forEach((shape, ndx) => {
            const speed = 1 + ndx * .001;
            const rot = time * speed;

            shape.rotation.y = rot;
        })
        renderer.render(scene, camera);
        requestAnimationFrame(q_animate);
    }
    q_animate();

    // PAWNS

    const geo_pawn = new THREE.CylinderGeometry(0.3, 0.5, 0.8, 16);
    const geo_pawn_head = new THREE.IcosahedronGeometry(0.45, 1);

    const w_pawn1 = new THREE.Mesh(geo_pawn, mat_white);
    const w_pawn2 = w_pawn1.clone();
    const w_pawn3 = w_pawn1.clone();
    const w_pawn4 = w_pawn1.clone();
    const w_pawn5 = w_pawn1.clone();
    const w_pawn6 = w_pawn1.clone();
    const w_pawn7 = w_pawn1.clone();
    const w_pawn8 = w_pawn1.clone();

    const w_pawn1_head = new THREE.Mesh(geo_pawn_head, mat_white);
    w_pawn1_head.scale.set(1, 0.5, 1);
    const w_pawn2_head = w_pawn1_head.clone();
    const w_pawn3_head = w_pawn1_head.clone();
    const w_pawn4_head = w_pawn1_head.clone();
    const w_pawn5_head = w_pawn1_head.clone();
    const w_pawn6_head = w_pawn1_head.clone();
    const w_pawn7_head = w_pawn1_head.clone();
    const w_pawn8_head = w_pawn1_head.clone();


    const b_pawn1 = new THREE.Mesh(geo_pawn, mat_black);
    const b_pawn2 = b_pawn1.clone();
    const b_pawn3 = b_pawn1.clone();
    const b_pawn4 = b_pawn1.clone();
    const b_pawn5 = b_pawn1.clone();
    const b_pawn6 = b_pawn1.clone();
    const b_pawn7 = b_pawn1.clone();
    const b_pawn8 = b_pawn1.clone();

    const b_pawn1_head = new THREE.Mesh(geo_pawn_head, mat_black);
    b_pawn1_head.scale.set(1, 0.5, 1);
    const b_pawn2_head = b_pawn1_head.clone();
    const b_pawn3_head = b_pawn1_head.clone();
    const b_pawn4_head = b_pawn1_head.clone();
    const b_pawn5_head = b_pawn1_head.clone();
    const b_pawn6_head = b_pawn1_head.clone();
    const b_pawn7_head = b_pawn1_head.clone();
    const b_pawn8_head = b_pawn1_head.clone();

    w_pawn1.position.set(5, 0.4, 7);
    w_pawn2.position.set(5, 0.4, 5);
    w_pawn3.position.set(5, 0.4, 3);
    w_pawn4.position.set(5, 0.4, 1);
    w_pawn5.position.set(1, 0.4, -1);
    w_pawn6.position.set(5, 0.4, -3);
    w_pawn7.position.set(5, 0.4, -5);
    w_pawn8.position.set(5, 0.4, -7);

    w_pawn1_head.position.set(0, 0.5, 0);
    w_pawn2_head.position.set(0, 0.5, 0);
    w_pawn3_head.position.set(0, 0.5, 0);
    w_pawn4_head.position.set(0, 0.5, 0);
    w_pawn5_head.position.set(0, 0.5, 0);
    w_pawn6_head.position.set(0, 0.5, 0);
    w_pawn7_head.position.set(0, 0.5, 0);
    w_pawn8_head.position.set(0, 0.5, 0);

    w_pawn1.add(w_pawn1_head)
    w_pawn2.add(w_pawn2_head)
    w_pawn3.add(w_pawn3_head)
    w_pawn4.add(w_pawn4_head)
    w_pawn5.add(w_pawn5_head)
    w_pawn6.add(w_pawn6_head)
    w_pawn7.add(w_pawn7_head)
    w_pawn8.add(w_pawn8_head)

    b_pawn1.position.set(-5, 0.4, 7);
    b_pawn2.position.set(-5, 0.4, 5);
    b_pawn3.position.set(-5, 0.4, 3);
    b_pawn4.position.set(-5, 0.4, 1);
    b_pawn5.position.set(-5, 0.4, -1);
    b_pawn6.position.set(-5, 0.4, -3);
    b_pawn7.position.set(-5, 0.4, -5);
    b_pawn8.position.set(-5, 0.4, -7);

    b_pawn1_head.position.set(0, 0.5, 0);
    b_pawn2_head.position.set(0, 0.5, 0);
    b_pawn3_head.position.set(0, 0.5, 0);
    b_pawn4_head.position.set(0, 0.5, 0);
    b_pawn5_head.position.set(0, 0.5, 0);
    b_pawn6_head.position.set(0, 0.5, 0);
    b_pawn7_head.position.set(0, 0.5, 0);
    b_pawn8_head.position.set(0, 0.5, 0);

    b_pawn1.add(b_pawn1_head)
    b_pawn2.add(b_pawn2_head)
    b_pawn3.add(b_pawn3_head)
    b_pawn4.add(b_pawn4_head)
    b_pawn5.add(b_pawn5_head)
    b_pawn6.add(b_pawn6_head)
    b_pawn7.add(b_pawn7_head)
    b_pawn8.add(b_pawn8_head)

    shapes.push(w_pawn1);
    shapes.push(w_pawn2);
    shapes.push(w_pawn3);
    shapes.push(w_pawn4);
    shapes.push(w_pawn5);
    shapes.push(w_pawn6);
    shapes.push(w_pawn7);
    shapes.push(w_pawn8);

    shapes.push(b_pawn1);
    shapes.push(b_pawn2);
    shapes.push(b_pawn3);
    shapes.push(b_pawn4);
    shapes.push(b_pawn5);
    shapes.push(b_pawn6);
    shapes.push(b_pawn7);
    shapes.push(b_pawn8);

    const coordinates = [
        // b_pawn5 to e5 [-1, 0.4, -1]
        // w_bishop2 to c4 [1, 0.4, 3]
        // b_horse1 to c6 [-3, 0.4, 3]
        // w_queen to h5 [1, 0.4, -7]
        // b_horse2 to f6 [-3, 0.4, -3]
        // w_queen to f7 checkmate [-5, 0.4, -3]

        new THREE.Vector3(-1, 0.4, -1),
        new THREE.Vector3(1, 0.5, 3),
        new THREE.Vector3(-3, 0.5, 3),
        new THREE.Vector3(-1, 0.75, -7),
        new THREE.Vector3(-3, 0.5, -3),
        new THREE.Vector3(-7, -2, -1) // King dies
    ]
    
    function b_e5() {
        requestAnimationFrame(b_e5);
        b_pawn5.position.lerp(coordinates[0], 0.15);
        renderer.render(scene, camera);
    }
    function w_Bc4() {
        requestAnimationFrame(w_Bc4);
        w_bishop2.position.lerp(coordinates[1], 0.15);
        renderer.render(scene, camera);
    }
    function b_Nc6() {
        requestAnimationFrame(b_Nc6);
        b_kn1.position.lerp(coordinates[2], 0.15);
        renderer.render(scene, camera);
    }
    function w_Qh5() {
        requestAnimationFrame(w_Qh5);
        w_queen.position.lerp(coordinates[3], 0.2);
        renderer.render(scene, camera);
    }
    function b_Nf6() {
        requestAnimationFrame(b_Nf6);
        b_kn2.position.lerp(coordinates[4], 0.15);
        renderer.render(scene, camera);
    }
    function b_Kff() {
        requestAnimationFrame(b_Kff);
        b_king.position.lerp(coordinates[5], 0.1);
        renderer.render(scene, camera);
    }

    setTimeout(b_e5, 500);
    setTimeout(w_Bc4, 3000);
    setTimeout(b_Nc6, 5500);
    setTimeout(w_Qh5, 8000);
    setTimeout(b_Nf6, 10500);
    setTimeout(b_Kff, 15000);

    function sceneAdd() {
        shapes.forEach((shape, ndx) => {
            scene.add(shape);
        })
    }
    sceneAdd();
}

main();