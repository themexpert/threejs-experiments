var scene, camera, renderer, mouseX=0, mouseY=0;


var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var init = function() {
    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth-20, window.innerHeight-20);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.renderReverseSided = false;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x333333));
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.castShadow = true;
    light.position.set( 0, 1500, 1000 );
    light.target.position.set( 0, 0, 0 );
    light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 700, 30000 ) );
    light.shadow.bias = 0.0001;
    light.shadow.mapSize.width = window.innerWidth;
    light.shadow.mapSize.height = window.innerHeight;
    light.shadow.darkness = 0.1;
    scene.add(light);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
    camera.position.y = 500;
    camera.position.z = 500;

    window.sphereMesh = EL.Sphere(100, 50, 50, 0x00ff00);
    sphereMesh.position.y = 100;
    scene.add(sphereMesh);

    window.ground = EL.Ground('images/Sky.jpg');
    scene.add(ground);

    window.cube = EL.Cube(100, 100, 100);
    cube.position.y = 50;
    cube.position.x = 1000;
    cube.position.z = -1000;
    scene.add(cube);

    window.mails = [];
    for(var i=0;i<20;i++) {
        var mail = EL.PlaneCube('images/gmail.png', 40, 0.001, 50);
        mails.push(mail);
        mail.position.set(100+i*100, 100, 0);
        mail.traverse(function (node) {
            if(node.material) {
                node.material.transparent = true;
            }
        });
        scene.add(mail);
    }
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    window.controls = new THREE.OrbitControls(camera);
    controls.autoRotate = true;
    // controls.addEventListener('change', render);
};

function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    // mouseY = event.clientY - windowHalfY;
}
var render = function () {
    TWEEN.update();
    requestAnimationFrame( render );

    mails.forEach(function (mail) {
        mail.position.x += 1;
        if(mail.position.x>600) {
            mail.traverse(function (node) {
                if(node.material) {
                    node.material.opacity -= 0.01;
                    node.material.transparent = true;
                }
            });
        }
        if(mail.position.x<100) {
            mail.traverse(function (node) {
                if(node.material && node.material.opacity<1) {
                    node.material.opacity += 0.01;
                    node.material.transparent = true;
                }
            });
        }
        if(mail.position.x>700) {
            mx = mail.position.x - 700;
            mail.position.x = -700+mx;
        }
    });
    // camera.position.x += 1;
    camera.lookAt( scene.position );

    renderer.render(scene, camera);
    controls.update();
};

if (Detector.webgl) {
    init();
    render();
} else {
    var warning = Detector.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}
