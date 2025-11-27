const voice = document.getElementById('voiceAudio');
const toggle = document.getElementById('musicToggle');

toggle.addEventListener('change', () => {
    if(toggle.checked){
        voice.play();
    } else {
        voice.pause();
        voice.currentTime = 0; // resets when toggle off
    }
});


// --- THREE.js Scene ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfff1f8);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 7);

const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('cakeCanvas'), antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const spotLight = new THREE.SpotLight(0xffffff, 1.2);
spotLight.position.set(5,10,5);
spotLight.castShadow = true;
scene.add(spotLight);

// Table
const tableTop = new THREE.Mesh(
    new THREE.CylinderGeometry(3,3,0.3,64),
    new THREE.MeshStandardMaterial({color:0xe0d4f0, roughness:0.3, metalness:0.5})
);
tableTop.position.y=-1;
tableTop.castShadow = tableTop.receiveShadow = true;
scene.add(tableTop);

const stand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5,0.8,1.5,32),
    new THREE.MeshStandardMaterial({color:0xc9b3ff, roughness:0.3, metalness:0.6})
);
stand.position.y=-1.9;
stand.castShadow=stand.receiveShadow=true;
scene.add(stand);

const loader = new THREE.TextureLoader();
loader.load('cinnamoroll.png', function(texture) {
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(2, 2, -1);
    sprite.scale.set(1, 1, 1);
    scene.add(sprite);
});


// Cake layers
function createCakeLayer(radius,height,color){
    const geo = new THREE.CylinderGeometry(radius,radius,height,64);
    const mat = new THREE.MeshStandardMaterial({color, roughness:0.4, metalness:0.1});
    const mesh = new THREE.Mesh(geo,mat);
    mesh.castShadow=true;
    return mesh;
}

const bottomLayer = createCakeLayer(1.5,1,0xffb6d9);
bottomLayer.position.y=0;
scene.add(bottomLayer);

const topLayer = createCakeLayer(1.1,0.7,0xffffff);
topLayer.position.y=0.85;
scene.add(topLayer);

const frosting = new THREE.Mesh(
    new THREE.TorusGeometry(1.15,0.15,16,100),
    new THREE.MeshStandardMaterial({color:0xff80b8, roughness:0.2})
);
frosting.rotation.x = Math.PI/2;
frosting.position.y=1.15;
frosting.castShadow=true;
scene.add(frosting);



// Candles
const candles = [];
for(let i=-1;i<=1;i++){
    const candle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08,0.08,0.7,32),
        new THREE.MeshStandardMaterial({color:0xffffe6})
    );
    candle.position.set(i*0.5,1.7,0);
    candle.castShadow=true;
    scene.add(candle);
    candles.push(candle);

    const flame = new THREE.Mesh(
        new THREE.SphereGeometry(0.12,16,16),
        new THREE.MeshBasicMaterial({color:0xffd27f})
    );
    flame.position.y=0.45;
    candle.add(flame);
}

// Balloons
const balloonColors = [0xff80c4,0xffd27f,0x80dfff];
balloonColors.forEach((color,i)=>{
    const balloon = new THREE.Mesh(
    new THREE.SphereGeometry(0.25,32,32), // balloon size
    new THREE.MeshStandardMaterial({color})
);

    balloon.position.set(3 + i*0.5,1.5 + i*0.2,-1);
    scene.add(balloon);

    const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02,0.02,0.5,8),
        new THREE.MeshStandardMaterial({color:0x555555})
    );
    stick.position.set(0,-0.35,0);
    balloon.add(stick);
});

// Animate
function animate(){
    requestAnimationFrame(animate);
    candles.forEach(c=>{
        const flame = c.children[0];
        const scale = 1 + Math.sin(Date.now()*0.02 + c.position.x)*0.15;
        flame.scale.set(scale, scale, scale);
    });
    controls.update();
    renderer.render(scene,camera);
}
animate();

// Resize
window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});
