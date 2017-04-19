var EL = {
    Sphere: function (radius, vX, vY, color) {
        var sg = new THREE.SphereGeometry(radius, vX, vY);
        var sx = new THREE.MeshPhongMaterial({color: color ? color : 0x00ff00});
        var sm = new THREE.Mesh(sg, sx);
        sm.castShadow = true;
        return sm;
    },
    Cube: function (width, height, length, color, rotateX, rotateY, rotateZ) {
        var sg = new THREE.CubeGeometry(width, height, length);
        var sx = new THREE.MeshPhongMaterial({color: color ? color : 0x00ff00});
        var sm = new THREE.Mesh(sg, sx);
        if(rotateX) sm.rotateX(rotateX);
        if(rotateY) sm.rotateX(rotateY);
        if(rotateZ) sm.rotateX(rotateZ);
        sm.castShadow = true;
        return sm;
    },
    Ground: function (url) {
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
        return mesh;
    },

    PlaneCube: function (url, width, height, length) {
        var loader = new THREE.TextureLoader();
        var groundTexture = loader.load(url);
        groundTexture.minFilter = THREE.LinearFilter;
        var groundMaterial = new THREE.MeshPhongMaterial( {map: groundTexture,} );
        var mesh = new THREE.Mesh( new THREE.CubeGeometry( length?length:200, width?width:2, height?height:100 ), groundMaterial );
        mesh.rotation.x = - Math.PI / 2;
        mesh.castShadow = true;
        return mesh;
    }
};