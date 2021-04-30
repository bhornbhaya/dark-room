let wall, wallB, i;
let roomobj = [];
import * as THREE from './build/three.module.js';

class room{
    constructor(a, b) {
        this.a = a;
        this.b = b;
        for (i = 0; i<2; i++){
            wall = new THREE.Mesh(
                new THREE.BoxGeometry(1,1,1),
                new THREE.MeshPhongMaterial({
                    color: "white",
                    specular: 0x050505,
                    shininess: 100,
                    side: THREE.DoubleSide})
            );
            roomobj.push(wall);
            wall.receiveShadow = true;
            wall.castShadow = true;
            wall.scale.set(this.a, 40, 1);

            wallB = new THREE.Mesh(
                new THREE.BoxGeometry(1,1,1),
                new THREE.MeshPhongMaterial({
                    color: "white",
                    specular: 0x050505,
                    shininess: 100,
                    side: THREE.DoubleSide})
            );
            roomobj.push(wallB);
            wallB.receiveShadow = true;
            wallB.castShadow = true;
            wallB.rotation.set(0, Math.PI / 2, 0);
            wallB.scale.set(this.b, 40, 1);
            wallB.position.z -= this.b / 2 + 0.5;

            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(1, 1),
                new THREE.MeshPhongMaterial({
                    color: "white",
                    specular: 0x050505,
                    shininess: 100,
                    side: THREE.DoubleSide})
            );
            roomobj.push(plane);
            plane.receiveShadow = true;
            plane.castShadow = true;
            plane.rotation.set(Math.PI / 2, 0, 0);
            plane.scale.set(this.a, this.b, 1);
            plane.position.z -= this.b / 2;

        }
        roomobj[1].position.x += this.a / 2 + 0.5;
        roomobj[2].position.y += 20;
        roomobj[3].position.z -= this.b + 0.5;
        roomobj[4].position.x -= this.a / 2 + 0.5;
        roomobj[5].position.y -= 20;
        for (i = 0; i<6; i++) {
            roomobj[i].position.x += a / 2;
            roomobj[i].position.z += 15;
        }
    }

    addTo(scene){
        for (i=0; i<roomobj.length; i++){
            scene.add(roomobj[i]);
        }
    }

    wallObj(a){
        return roomobj[a];
    }

}
export {room};