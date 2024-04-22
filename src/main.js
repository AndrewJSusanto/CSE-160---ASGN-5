//import * as THREE from '../node_modules/three/build/three.module.js';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer( {antialias: true, canvas} );

    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 40;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //camera.position.z = 3;
    camera.position.set( 0, 3, 15 );
    const scene = new THREE.Scene();

    // LIGHT SOURCE
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // TEXTURES
    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);
    //const wall_texture = loader.load( '../resources/images/wall.jpg')
    //wall_texture.colorSpace = THREE.SRGBColorSpace;
    const materials = [
        new THREE.MeshBasicMaterial( {map: loadColorTexture( '../resources/images/flower-1.jpg')} ),
        new THREE.MeshBasicMaterial( {map: loadColorTexture( '../resources/images/flower-2.jpg')} ),
        new THREE.MeshBasicMaterial( {map: loadColorTexture( '../resources/images/flower-3.jpg')} ),
        new THREE.MeshBasicMaterial( {map: loadColorTexture( '../resources/images/flower-4.jpg')} ),
        new THREE.MeshBasicMaterial( {map: loadColorTexture( '../resources/images/flower-5.jpg')} ),
        new THREE.MeshBasicMaterial( {map: loadColorTexture( '../resources/images/flower-6.jpg')} ),
    ]

    // LANDSCAPE
    const planeSize = 20;
    const checker_texture = loader.load('../resources/images/checker.png');
    checker_texture.colorSpace = THREE.SRGBColorSpace;
    checker_texture.wrapS = THREE.RepeatWrapping;
    checker_texture.wrapT = THREE.RepeatWrapping;
    checker_texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    checker_texture.repeat.set( repeats, repeats  );

    const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
    const planeMat = new THREE.MeshPhongMaterial( {
        map: checker_texture,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh( planeGeo, planeMat );
    mesh.rotation.x = Math.PI * -.5;
    scene.add( mesh );

    // CUSTOM 3D OBJ
    const objLoader = new OBJLoader();
    objLoader.load('../resources/models/bench/Bench.obj', (root) => {
        root.scale.setScalar(10);
        root.position.set(2.5, 0, -2.2)
        root.rotation.y = 2.7;
        root.traverse(node => {
            const material = new THREE.MeshPhongMaterial( {
                color: 0x964B00,
            })
            if (material) {
                node.material = material;
            }
        }) 
        scene.add(root);
        // add material textures
    })

    // SPHERE
    // radius, height segments, width segments
    const sphere_texture = loader.load('../resources/images/sunrays.jpg');
    sphere_texture.colorSpace = THREE.SRGBColorSpace;
    sphere_texture.wrapS = THREE.RepeatWrapping;
    sphere_texture.wrapT = THREE.RepeatWrapping;
    sphere_texture.magFilter = THREE.NearestFilter;
    const sphere_geometry = new THREE.SphereGeometry(1.5, 32, 16);
    const sphere_color = new THREE.Color(0xFFFF00)
    // MeshStandardMaterial has some gloss for lightsource feedback
    const sphere_material = new THREE.MeshStandardMaterial( {
        map: sphere_texture,
        color: 0xFFFFFF,
        roughness: 0} );
    const sphere = new THREE.Mesh( sphere_geometry, sphere_material );
    sphere.material.color = sphere_color;
    sphere.position.set(-5, 6, -3);
    scene.add(sphere);

    function animate(time) {
        time *= 0.001;

        requestAnimationFrame(animate);
        sphere.rotation.x = time;
        sphere.rotation.y = time;

        renderer.render(scene, camera);
    
    }
    requestAnimationFrame(animate);

    // CYLINDER
    const cyl_geometry = new THREE.CylinderGeometry(0.25, 0.5, 2, 16);
    const cyl_material = new THREE.MeshPhongMaterial( {color: 0x44aa88} );
    const cylinder = new THREE.Mesh( cyl_geometry, cyl_material);
    cylinder.position.set(6, 1, 1);
    scene.add(cylinder);

    // function cyl_animate(time) {
    //     time *= 0.001;

    //     requestAnimationFrame(cyl_animate);
    //     cylinder.rotation.x = time;

    //     renderer.render(scene, camera);
    // }
    //requestAnimationFrame(cyl_animate);



    // CUBE
    const boxWidth = 1.25;
    const boxHeight = 1.25;
    const boxDepth = 1.25;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    //const material = new THREE.MeshPhongMaterial( {color: 0x44aa88} );
    //const cube = new THREE.Mesh(geometry, material);
    const cubes = [];

    // Cube rendering with multiple texture load wait
    loadManager.onLoad = () => {
        const cube = new THREE.Mesh(geometry, materials);
        cube.position.set(6, 2, 1);
        scene.add(cube);
        cubes.push(cube);
        
    };

    function render(time) {
        time *= 0.001;
        
        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot / 1.5;
        })
    
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    // function makeInstance(geometry, color, x) {
    //     //const material = new THREE.MeshPhongMaterial( {color} );
    //     const material = new THREE.MeshPhongMaterial ( {
    //         color: 0x8844aa,
    //         //map: texture,
    //     });
    //     const cube = new THREE.Mesh(geometry, material);
    //     scene.add(cube);

    //     cube.position.x = x;

    //     return cube;
    // }

    function loadColorTexture(path) {
        const texture = loader.load(path);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }

    requestAnimationFrame(render);
}

main();