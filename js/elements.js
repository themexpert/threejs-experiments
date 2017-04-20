function EL() {
    this.objects = {};
}
EL.prototype.Scene = function (callback) {
    var scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x333333));
    this.objects.scene = scene;
    if(callback) callback.call(this, scene);
};

EL.prototype.Camera = function (depth, aspect, far, x, y, z, callback) {
    var camera = new THREE.PerspectiveCamera(depth?depth:75, aspect?aspect:window.innerWidth / window.innerHeight, 0.1, far?far:100000);
    camera.position.set(x?x:0, y?y:500, z?z:500);
    this.objects.camera = camera;
    if(callback) callback.call(this, camera);
};

EL.prototype.Light = function (color, depth, far, p, s, callback) {
    var light = new THREE.DirectionalLight(color?color:0xffffff, 1);
    light.castShadow = true;
    light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( depth?depth:50, 1, 700, far?far:30000 ) );
    light.shadow.bias = 0.0001;
    light.shadow.mapSize.width = window.innerWidth;
    light.shadow.mapSize.height = window.innerHeight;
    light.shadow.darkness = 0.1;
    light.position.set(p.x?p.x:0, p.y?p.y:0, p.z?p.z:0);
    light.target.position.set( s.x, s.y, s.z );
    this.objects.scene.add(light);
    if(callback) callback.call(this, light);
};

EL.prototype.Renderer = function (x, y, callback) {
    var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(x?x:window.innerWidth-20, y?y:window.innerHeight-20);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.renderReverseSided = false;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    this.objects.renderer = renderer;
    document.body.appendChild(renderer.domElement);
    if(callback) callback.call(this, renderer);
};

EL.prototype.Render = function (callback) {
    if(window.ELObj === undefined) window.ELObj = this;
    requestAnimationFrame(  window.ELObj.Render );
    if(window.ELObj.RenderCallback === undefined) window.ELObj.RenderCallback = callback;
    window.ELObj.RenderCallback.call(window.ELObj);
    window.ELObj.objects.camera.lookAt( window.ELObj.objects.scene.position );
    window.ELObj.objects.renderer.render(window.ELObj.objects.scene, window.ELObj.objects.camera);
    window.ELObj.objects.controls.update();
};

EL.prototype.ImgCube = function (url, width, height, length, callback) {
    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load(url);
    groundTexture.minFilter = THREE.LinearFilter;
    var groundMaterial = new THREE.MeshPhongMaterial( {map: groundTexture,} );
    var mesh = new THREE.Mesh( new THREE.CubeGeometry( length?length:200, width?width:2, height?height:100 ), groundMaterial );
    mesh.rotation.x = - Math.PI / 2;
    mesh.castShadow = true;
    this.objects.scene.add(mesh);
    if(callback) callback.call(this, mesh);
};

EL.prototype.Ground = function (url, callback) {
    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load(url);
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 1, 1 );
    groundTexture.anisotropy = 100;
    groundTexture.minFilter = THREE.LinearFilter;
    // var groundTexture = new THREE.MeshBasicMaterial({color: url});
    var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
    mesh.position.y = 0;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.objects.scene.add(mesh);
    if(callback) callback.call(this, mesh);
};

EL.prototype.Cube = function (width, height, length, color, rotateX, rotateY, rotateZ, x, y, z, callback) {
    var sg = new THREE.CubeGeometry(width, height, length);
    var sx = new THREE.MeshPhongMaterial({color: color ? color : 0x00ff00});
    var sm = new THREE.Mesh(sg, sx);
    sm.rotation.set(rotateX?rotateX:0, rotateY?rotateY:0, rotateZ?rotateZ:0);
    sm.position.set(x?x:0, y?y:0, z?z:0);
    sm.castShadow = true;
    this.objects.scene.add(sm);
    if(callback) callback.call(this, sm);
};

EL.prototype.Sphere = function (radius, vX, vY, color, callback) {
    var sg = new THREE.SphereGeometry(radius, vX, vY);
    var sx = new THREE.MeshPhongMaterial({color: color ? color : 0x00ff00});
    var sm = new THREE.Mesh(sg, sx);
    sm.castShadow = true;
    this.objects.scene.add(sm);
    if(callback) callback.call(this, sm);
};

EL.prototype.Controls = function (callback) {
    var controls = new THREE.OrbitControls(this.objects.camera);
    controls.autoRotate = true;
    if(callback) callback.call(this, controls);
    this.objects.controls = controls;
};

EL.prototype.MoveMailBoxes = function (mails) {
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
};