let scene, camera, renderer, player, incenseSmoke = null;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let isMusicPlaying = false;
let streamWater;

function init3D() {
    const container = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb2daf2);
    scene.fog = new THREE.FogExp2(0xb2daf2, 0.012);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xfffaed, 0.9);
    sunLight.position.set(30, 40, 20);
    scene.add(sunLight);

    const floorGeo = new THREE.PlaneGeometry(150, 150);
    const floorMat = new THREE.MeshLambertMaterial({ color: 0x486b32 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const mountainGeo = new THREE.ConeGeometry(25, 45, 5);
    const mountainMat = new THREE.MeshLambertMaterial({ color: 0x3d5236 });
    
    const mPositions = [
        [-50, 15, -50], [-25, 15, -60], [0, 20, -65], 
        [25, 15, -60], [50, 15, -50], [-60, 10, -20]
    ];
    mPositions.forEach(pos => {
        const mountain = new THREE.Mesh(mountainGeo, mountainMat);
        mountain.position.set(pos[0], pos[1], pos[2]);
        const scale = 0.8 + Math.random() * 0.5;
        mountain.scale.set(scale, scale, scale);
        scene.add(mountain);
    });

    const streamGeo = new THREE.BoxGeometry(8, 0.1, 150);
    const streamMat = new THREE.MeshLambertMaterial({ color: 0x4ca6a4, transparent: true, opacity: 0.85 });
    streamWater = new THREE.Mesh(streamGeo, streamMat);
    streamWater.position.set(22, 0.05, 0);
    scene.add(streamWater);

    function createTree(x, z) {
        const treeGroup = new THREE.Group();
        const trunkGeo = new THREE.CylinderGeometry(0.2, 0.4, 2.5, 8);
        const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5a3d28 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1.25;
        treeGroup.add(trunk);

        const leavesGeo = new THREE.ConeGeometry(1.8, 3.5, 8);
        const leavesMat = new THREE.MeshLambertMaterial({ color: 0x224d17 });
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.y = 3.5;
        treeGroup.add(leaves);

        treeGroup.position.set(x, 0, z);
        scene.add(treeGroup);
    }

    for (let i = 0; i < 50; i++) {
        let x = (Math.random() - 0.5) * 120;
        let z = (Math.random() - 0.5) * 120;
        if (Math.abs(x) > 12 && Math.abs(x - 22) > 6 && z < 20) {
            createTree(x, z);
        }
    }

    const templeGeo = new THREE.BoxGeometry(12, 8, 12);
    const templeMat = new THREE.MeshLambertMaterial({ color: 0x7c3f22 });
    const temple = new THREE.Mesh(templeGeo, templeMat);
    temple.position.set(0, 4, -15);
    scene.add(temple);

    const buddhaGeo = new THREE.CylinderGeometry(1, 1.5, 3, 8);
    const buddhaMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const buddha = new THREE.Mesh(buddhaGeo, buddhaMat);
    buddha.position.set(0, 3, -14);
    scene.add(buddha);

    const potGeo = new THREE.CylinderGeometry(0.8, 0.5, 1, 16);
    const potMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.set(0, 0.5, -6);
    scene.add(pot);

    const playerGeo = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const playerMat = new THREE.MeshLambertMaterial({ color: 0x2b5797 });
    player = new THREE.Mesh(playerGeo, playerMat);
    player.position.set(0, 1, 5);
    scene.add(player);

    setupControls();
    animate();
}

function setupControls() {
    document.addEventListener('keydown', (e) => {
        if(e.code === 'KeyW' || e.code === 'ArrowUp') moveForward = true;
        if(e.code === 'KeyS' || e.code === 'ArrowDown') moveBackward = true;
        if(e.code === 'KeyA' || e.code === 'ArrowLeft') moveLeft = true;
        if(e.code === 'KeyD' || e.code === 'ArrowRight') moveRight = true;
    });
    document.addEventListener('keyup', (e) => {
        if(e.code === 'KeyW' || e.code === 'ArrowUp') moveForward = false;
        if(e.code === 'KeyS' || e.code === 'ArrowDown') moveBackward = false;
        if(e.code === 'KeyA' || e.code === 'ArrowLeft') moveLeft = false;
        if(e.code === 'KeyD' || e.code === 'ArrowRight') moveRight = false;
    });
}

function animate() {
    requestAnimationFrame(animate);
    const speed = 0.1;
    if (moveForward) player.position.z -= speed;
    if (moveBackward) player.position.z += speed;
    if (moveLeft) player.position.x -= speed;
    if (moveRight) player.position.x += speed;

    camera.position.set(player.position.x, player.position.y + 4, player.position.z + 8);
    camera.lookAt(player.position);

    if (streamWater) {
        streamWater.position.x = 22 + Math.sin(Date.now() * 0.003) * 0.05;
    }

    if (incenseSmoke) {
        incenseSmoke.position.y += 0.02;
        if(incenseSmoke.position.y > 4) incenseSmoke.position.y = 1;
    }
    renderer.render(scene, camera);
}

function toggleMusic() {
    const music = document.getElementById('bg-music');
    if(!isMusicPlaying) { music.play(); isMusicPlaying = true; } 
    else { music.pause(); isMusicPlaying = false; }
}

function thapHuong() {
    if (!incenseSmoke) {
        const smokeGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const smokeMat = new THREE.MeshBasicMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.5 });
        incenseSmoke = new THREE.Mesh(smokeGeo, smokeMat);
        incenseSmoke.position.set(0, 1, -6);
        scene.add(incenseSmoke);
        alert("Đã thắp hương bái Phật. Tâm thành nguyện đạt.");
    }
}

function goChuong() {
    const bell = document.getElementById('bell-sound');
    bell.currentTime = 0;
    bell.play();
    player.position.y += 0.2; setTimeout(() => player.position.y -= 0.2, 100);
}

function openPrayer() { document.getElementById('prayer-modal').style.display = 'block'; }
function closePrayer() { document.getElementById('prayer-modal').style.display = 'none'; }

function sendPrayer() {
    const text = document.getElementById('prayer-text').value;
    if(text.trim() === "") { alert("Vui lòng ghi lời khấn nguyện."); return; }
    alert("Lời nguyện ước của bạn đã được chuyển hóa thành hoa đăng gửi đến mười phương chư Phật.");
    document.getElementById('prayer-text').value = "";
    closePrayer();
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
