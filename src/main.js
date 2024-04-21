//import * as THREE from '../node_modules/three/build/three.module.js';
import * as THREE from 'three';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer( {antialias: true, canvas} );

    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.z = 2;
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

    // SPHERE
    // radius, height segments, width segments
    const sphere_geometry = new THREE.SphereGeometry(0.5, 32, 16);
    // MeshStandardMaterial has some gloss for lightsource feedback
    const sphere_material = new THREE.MeshStandardMaterial( { color: 0xFFFFFF, roughness: 0} );
    const sphere = new THREE.Mesh( sphere_geometry, sphere_material );
    sphere.position.x = 1.5
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
    const cyl_geometry = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
    const cyl_material = new THREE.MeshPhongMaterial( {color: 0x44aa88} );
    const cylinder = new THREE.Mesh( cyl_geometry, cyl_material);
    cylinder.position.x = -1.5;
    scene.add(cylinder);

    function cyl_animate(time) {
        time *= 0.001;

        requestAnimationFrame(cyl_animate);
        cylinder.rotation.x = time;

        renderer.render(scene, camera);
    }
    requestAnimationFrame(cyl_animate);



    // CUBE
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    //const material = new THREE.MeshPhongMaterial( {color: 0x44aa88} );
    //const cube = new THREE.Mesh(geometry, material);
    const cubes = [];

    // Cube rendering with multiple texture load wait
    loadManager.onLoad = () => {
        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);
        cubes.push(cube);
    };

    function render(time) {
        time *= 0.001;
        
        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
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