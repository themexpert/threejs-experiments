var objects = {}, e;

var init = function() {
    e = new EL();
    e.Renderer();
    e.Scene();
    e.Light(0xffffff, 50, 300000, {x:0, y:1500, z:1000}, {x:0, y:0, z:0});
    e.Camera();
    e.Ground('images/Sky.jpg');
    e.ImgCube('images/Sky.jpg', 100, 100, 100, function (box) {
        box.position.set(0, 155, 0);
        objects.box = box;
    });
    e.ImgCube('images/Sky.jpg', 100, 100, 100, function (box) {
        box.position.set(0, 50, 0);
    });
    objects.mails = [];
    for(var i=0;i<20;i++) {
        e.ImgCube('images/gmail.png', 40, 0.001, 50, function (mail) {
            objects.mails.push(mail);
            mail.position.set(100+i*100, 103, 0);
            mail.traverse(function (node) {
                if(node.material) {
                    node.material.transparent = true;
                }
            });
        });
    }
    e.Controls();
    e.Render(function () {
        e.MoveMailBoxes(objects.mails);
        objects.box.rotation.y -= 0.1;
    });
};
init();

