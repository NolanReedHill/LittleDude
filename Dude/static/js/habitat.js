function initPhysics() {
    const imageUrl = "/static/images/tree.jpg";
    const imgElement = document.createElement("img");
    imgElement.src = imageUrl;

    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse
    Composite = Matter.Composite;

// create an engine
    var engine = Engine.create();
    var world = engine.world;
// create a renderer
    var render = Render.create({
        element: document.getElementById("renderArea"),
        engine: engine,
        options: {
            width: 1280,
            height: 640,
            hasBounds: true,
            wireframes: false
        }
    });

    // ball
//    var ball = Bodies.circle(200, 200, 100, 80, {
//        render: {
//            sprite: {
//                texture: "/static/images/Beach_Ball.jpg",
//                xScale: 0.5,
//                yScale: 0.5
//            }
//        }
//    });

    // make a tree box
    var boxA = Bodies.rectangle(400, 200, 100, 80, {
        render: {
            sprite: {
                texture: imageUrl,
                xScale: 0.5,
                yScale: 0.3
            }
        }
    });
    var creatureType = document.getElementById("littleDudeType").value
    if (creatureType === "Biped") {
        Composite.add(world, biped(800,200,1));
    } else if (creatureType === "Quadraped") {
        Composite.add(world, quadruped(800,200,1));
    } else if (creatureType === "Ooze") {
        // generate an ooze
        var particleOptions = {
            friction: 0.05,
            frictionStatic: 0.1,
            render: {visible: true}
        };

        Composite.add(world, [
            // see softBody function defined later in this file
            ooze(800, 200, 10, 15, 0, 0, true, 10, particleOptions),
        ]);
    }
    // var ragdoll = biped(800, 200, 1)
    var wallOptions = {
        isStatic:true,
        render: {
            fillStyle: 'grey',
            strokeStyle: 'grey',
            lineWidth: 3
        }
    }

        Composite.add(world, [
            // walls
            Bodies.rectangle(400, -50, 2000, 300, wallOptions),
            Bodies.rectangle(400, 700, 2000, 300, wallOptions),
            Bodies.rectangle(1380, 300, 300, 800, wallOptions  ),
            Bodies.rectangle(-100, 300, 300, 800, wallOptions   )
        ]);

// add all of the bodies to the world
    Composite.add(engine.world, [boxA,]);


// run the renderer
    Render.run(render);

// create runner
    var runner = Runner.create();

// run the engine
    Runner.run(runner, engine);

// add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
    render.mouse = mouse;

    class bipedBodyImages {
        leftLeg;
        rightLeg;
        leftArm;
        rightArm;

        constructor(leftLeg, rightLeg, leftArm, rightArm) {
            this.leftLeg = leftLeg
            this.rightLeg = rightLeg
            this.leftArm = leftArm
            this.rightArm = rightArm
        }
    }

    class oozeBodyImage {

    }

    function biped(x, y, scale, options, bodyParts) {
        scale = typeof scale === 'undefined' ? 1 : scale;

        var Body = Matter.Body,
            Bodies = Matter.Bodies,
            Constraint = Matter.Constraint,
            Composite = Matter.Composite,
            Common = Matter.Common;

        var headOptions = Common.extend({
            label: 'head',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: [15 * scale, 15 * scale, 15 * scale, 15 * scale]
            },
            render: {
                fillStyle: '#FFBC42'
            }
        }, options);

        var chestOptions = Common.extend({
            label: 'chest',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: [20 * scale, 20 * scale, 26 * scale, 26 * scale]
            },
            render: {
                fillStyle: '#E0A423'
            }
        }, options);

        var leftArmOptions = Common.extend({
            label: 'left-arm',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: {
                fillStyle: '#FFBC42'
            }
        }, options);

        var leftLowerArmOptions = Common.extend({}, leftArmOptions, {
            render: {
                fillStyle: '#E59B12'
            }
        });

        var rightArmOptions = Common.extend({
            label: 'right-arm',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: {
                fillStyle: '#FFBC42'
            }
        }, options);

        var rightLowerArmOptions = Common.extend({}, rightArmOptions, {
            render: {
                fillStyle: '#E59B12'
            }
        });

        var leftLegOptions = Common.extend({
            label: 'left-leg',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: {
                fillStyle: '#FFBC42'
            }
        }, options);

        var leftLowerLegOptions = Common.extend({}, leftLegOptions, {
            render: {
                fillStyle: '#E59B12'
            }
        });

        var rightLegOptions = Common.extend({
            label: 'right-leg',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: {
                fillStyle: '#FFBC42'
            }
        }, options);

        var rightLowerLegOptions = Common.extend({}, rightLegOptions, {
            render: {
                fillStyle: '#E59B12'
            }
        });

        var head = Bodies.rectangle(x, y - 60 * scale, 34 * scale, 40 * scale, headOptions);
        var chest = Bodies.rectangle(x, y, 55 * scale, 80 * scale, chestOptions);
        var rightUpperArm = Bodies.rectangle(x + 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, rightArmOptions);
        var rightLowerArm = Bodies.rectangle(x + 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, rightLowerArmOptions);
        var leftUpperArm = Bodies.rectangle(x - 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, leftArmOptions);
        var leftLowerArm = Bodies.rectangle(x - 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, leftLowerArmOptions);
        var leftUpperLeg = Bodies.rectangle(x - 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, leftLegOptions);
        var leftLowerLeg = Bodies.rectangle(x - 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, leftLowerLegOptions);
        var rightUpperLeg = Bodies.rectangle(x + 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, rightLegOptions);
        var rightLowerLeg = Bodies.rectangle(x + 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, rightLowerLegOptions);
        Matter.Body.setInertia(leftUpperLeg, Infinity);
        Matter.Body.setInertia(leftLowerLeg, Infinity);
        Matter.Body.setInertia(rightUpperLeg, Infinity);
        Matter.Body.setInertia(rightLowerLeg, Infinity);
        Matter.Body.setInertia(chest, Infinity);
        var chestToRightUpperArm = Constraint.create({
            bodyA: chest,
            pointA: {
                x: 24 * scale,
                y: -23 * scale
            },
            pointB: {
                x: 0,
                y: -8 * scale
            },
            bodyB: rightUpperArm,
            stiffness: 0.6,
            render: {
                visible: false
            }
        });

        var chestToLeftUpperArm = Constraint.create({
            bodyA: chest,
            pointA: {
                x: -24 * scale,
                y: -23 * scale
            },
            pointB: {
                x: 0,
                y: -8 * scale
            },
            bodyB: leftUpperArm,
            stiffness: 0.6,
            render: {
                visible: false
            }
        });

        var chestToLeftUpperLeg = Constraint.create({
            bodyA: chest,
            pointA: {
                x: -10 * scale,
                y: 30 * scale
            },
            pointB: {
                x: 0,
                y: -10 * scale
            },
            bodyB: leftUpperLeg,
            stiffness: 1,
            render: {
                visible: false
            }
        });

        var chestToRightUpperLeg = Constraint.create({
            bodyA: chest,
            pointA: {
                x: 10 * scale,
                y: 30 * scale
            },
            pointB: {
                x: 0,
                y: -10 * scale
            },
            bodyB: rightUpperLeg,
            stiffness: 1,
            render: {
                visible: false
            }
        });

        var upperToLowerRightArm = Constraint.create({
            bodyA: rightUpperArm,
            bodyB: rightLowerArm,
            pointA: {
                x: 0,
                y: 15 * scale
            },
            pointB: {
                x: 0,
                y: -25 * scale
            },
            stiffness: 0.6,
            render: {
                visible: false
            }
        });

        var upperToLowerLeftArm = Constraint.create({
            bodyA: leftUpperArm,
            bodyB: leftLowerArm,
            pointA: {
                x: 0,
                y: 15 * scale
            },
            pointB: {
                x: 0,
                y: -25 * scale
            },
            stiffness: 0.6,
            render: {
                visible: false
            }
        });

        var upperToLowerLeftLeg = Constraint.create({
            bodyA: leftUpperLeg,
            bodyB: leftLowerLeg,
            pointA: {
                x: 0,
                y: 20 * scale
            },
            pointB: {
                x: 0,
                y: -20 * scale
            },
            stiffness: 1,
            render: {
                visible: false
            }
        });

        var upperToLowerRightLeg = Constraint.create({
            bodyA: rightUpperLeg,
            bodyB: rightLowerLeg,
            pointA: {
                x: 0,
                y: 20 * scale
            },
            pointB: {
                x: 0,
                y: -20 * scale
            },
            stiffness: 1,
            render: {
                visible: false
            }
        });

        var headContraint = Constraint.create({
            bodyA: head,
            pointA: {
                x: 0,
                y: 25 * scale
            },
            pointB: {
                x: 0,
                y: -35 * scale
            },
            bodyB: chest,
            stiffness: 0.6,
            render: {
                visible: false
            }
        });

        var legToLeg = Constraint.create({
            bodyA: leftLowerLeg,
            bodyB: rightLowerLeg,
            stiffness: 0.01,
            render: {
                visible: false
            }
        });

        var person = Composite.create({
            bodies: [
                chest, head, leftLowerArm, leftUpperArm,
                rightLowerArm, rightUpperArm, leftLowerLeg,
                rightLowerLeg, leftUpperLeg, rightUpperLeg
            ],
            constraints: [
                upperToLowerLeftArm, upperToLowerRightArm, chestToLeftUpperArm,
                chestToRightUpperArm, headContraint, upperToLowerLeftLeg,
                upperToLowerRightLeg, chestToLeftUpperLeg, chestToRightUpperLeg,
                legToLeg
            ]
        });

        return person;
    }

    function quadruped(x, y, scale, options) {
        scale = typeof scale === 'undefined' ? 1 : scale;


        var Body = Matter.Body,
            Bodies = Matter.Bodies,
            Constraint = Matter.Constraint,
            Composite = Matter.Composite,
            Common = Matter.Common;

        var headOptions = Common.extend({
            label: 'head',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: [15 * scale, 15 * scale, 15 * scale, 15 * scale]
            },
            render: {
                fillStyle: '#FFBC42'
            }
        }, options);

        var chestOptions = Common.extend({
            label: 'chest',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: [20 * scale, 20 * scale, 26 * scale, 26 * scale]
            },
            render: {
                fillStyle: '#E0A423'
            }
        }, options);

        var leftArmOptions = Common.extend({
            label: 'left-arm',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: {
                fillStyle: '#FFBC42'
            }
        }, options);

        var leftLowerArmOptions = Common.extend({}, leftArmOptions, {
            render: {
                fillStyle: '#E59B12'
            }
        });

        var rightArmOptions = Common.extend({
            label: 'right-arm',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: {
                fillStyle: '#FFBC42'
            }
        }, options);

        var rightLowerArmOptions = Common.extend({}, rightArmOptions, {
            render: {
                fillStyle: '#E59B12'
            }
        });

        var leftLegOptions = Common.extend({
            label: 'left-leg',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: {
                fillStyle: '#FFBC42'
            }
        }, options);

        var leftLowerLegOptions = Common.extend({}, leftLegOptions, {
            render: {
                fillStyle: '#E59B12'
            }
        });

        var rightLegOptions = Common.extend({
            label: 'right-leg',
            collisionFilter: {
                group: Body.nextGroup(true)
            },
            chamfer: {
                radius: 10 * scale
            },
            render: {
                fillStyle: '#FFBC42'
            }
        }, options);

        var rightLowerLegOptions = Common.extend({}, rightLegOptions, {
            render: {
                fillStyle: '#E59B12'
            }
        });

        var head = Bodies.rectangle(x, y - 55 * scale, 34 * scale, 40 * scale, headOptions);
        var chest = Bodies.rectangle(x, y, 55 * scale, 80 * scale, chestOptions);
        var rightUpperArm = Bodies.rectangle(x + 39 * scale, y - 15 * scale, 20 * scale, 40 * scale, rightArmOptions);
        var rightLowerArm = Bodies.rectangle(x + 39 * scale, y + 25 * scale, 20 * scale, 60 * scale, rightLowerArmOptions);
        var leftUpperArm = Bodies.rectangle(x + 39 * scale, y + 20 * scale, 20 * scale, 40 * scale, leftArmOptions);
        var leftLowerArm = Bodies.rectangle(x + 39 * scale, y + 55 * scale, 20 * scale, 60 * scale, leftLowerArmOptions);
        var leftUpperLeg = Bodies.rectangle(x + 20 * scale, y + 67 * scale, 20 * scale, 40 * scale, leftLegOptions);
        var leftLowerLeg = Bodies.rectangle(x + 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, leftLowerLegOptions);
        var rightUpperLeg = Bodies.rectangle(x + 20 * scale, y + 57 * scale, 20 * scale, 40 * scale, rightLegOptions);
        var rightLowerLeg = Bodies.rectangle(x + 20 * scale, y + 97 * scale, 20 * scale, 60 * scale, rightLowerLegOptions);


        var chestToRightUpperArm = Constraint.create({
            bodyA: chest,
            pointA: {
                x: 24 * scale,
                y: -23 * scale
            },
            pointB: {
                x: 0,
                y: -8 * scale
            },
            bodyB: rightUpperArm,
            stiffness: 0.6,
            render: {
                visible: false
            }
        });

        var chestToLeftUpperArm = Constraint.create({
            bodyA: chest,
            pointA: {
                x: 24 * scale,
                y: -15 * scale
            },
            pointB: {
                x: 0,
                y: -8 * scale
            },
            bodyB: leftUpperArm,
            stiffness: 0.6,
            render: {
                visible: false
            }
        });

        var chestToLeftUpperLeg = Constraint.create({
            bodyA: chest,
            pointA: {
                x: -1 * scale,
                y: 30 * scale
            },
            pointB: {
                x: 0,
                y: -10 * scale
            },
            bodyB: leftUpperLeg,
            stiffness: 0.6,
            render: {
                visible: false
            }
        });

        var chestToRightUpperLeg = Constraint.create({
            bodyA: chest,
            pointA: {
                x: 10 * scale,
                y: 30 * scale
            },
            pointB: {
                x: 0,
                y: -10 * scale
            },
            bodyB: rightUpperLeg,
            stiffness: 0.6,
            render: {
                visible: false
            }
        });

        var upperToLowerRightArm = Constraint.create({
            bodyA: rightUpperArm,
            bodyB: rightLowerArm,
            pointA: {
                x: 0,
                y: 15 * scale
            },
            pointB: {
                x: 0,
                y: -25 * scale
            },
            stiffness: 0.6,
            render: {
                visible: false
            }
        });

        var upperToLowerLeftArm = Constraint.create({
            bodyA: leftUpperArm,
            bodyB: leftLowerArm,
            pointA: {
                x: 0,
                y: 15 * scale
            },
            pointB: {
                x: 0,
                y: -25 * scale
            },
            stiffness: 0.6,
            render: {
                visible: false
            }
        });

        var upperToLowerLeftLeg = Constraint.create({
            bodyA: leftUpperLeg,
            bodyB: leftLowerLeg,
            pointA: {
                x: 0,
                y: 20 * scale
            },
            pointB: {
                x: 0,
                y: -20 * scale
            },
            stiffness: 0.6,
            render: {
                visible: false
            }
        });

        var upperToLowerRightLeg = Constraint.create({
            bodyA: rightUpperLeg,
            bodyB: rightLowerLeg,
            pointA: {
                x: 0,
                y: 20 * scale
            },
            pointB: {
                x: 0,
                y: -20 * scale
            },
            stiffness: 0.6,
            render: {
                visible: false
            }
        });

        var headContraint = Constraint.create({
            bodyA: head,
            pointA: {
                x: -1 * scale,
                y: 25 * scale
            },
            pointB: {
                x: -1 * scale,
                y: -35 * scale
            },
            bodyB: chest,
            stiffness: 0.6,
            render: {
                visible: false
            }
        });

        var legToLeg = Constraint.create({
            bodyA: leftLowerLeg,
            bodyB: rightLowerLeg,
            stiffness: 0.01,
            render: {
                visible: false
            }
        });

        var person = Composite.create({
            bodies: [
                chest, head, leftLowerArm, leftUpperArm,
                rightLowerArm, rightUpperArm, leftLowerLeg,
                rightLowerLeg, leftUpperLeg, rightUpperLeg
            ],
            constraints: [
                upperToLowerLeftArm, upperToLowerRightArm, chestToLeftUpperArm,
                chestToRightUpperArm, headContraint, upperToLowerLeftLeg,
                upperToLowerRightLeg, chestToLeftUpperLeg, chestToRightUpperLeg,
                legToLeg
            ]
        });


        Composite.rotate(person, 90, {x, y})
        return person;
    }

    function ooze(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions, oozeBodyImage) {
        var Common = Matter.Common,
            Composites = Matter.Composites,
            Bodies = Matter.Bodies;

        particleOptions = Common.extend({inertia: Infinity}, particleOptions);
        constraintOptions = Common.extend({stiffness: 0.2, render: {type: 'line', anchors: false}}, constraintOptions);

        var softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function (x, y) {
            return Bodies.circle(x, y, particleRadius, particleOptions);
        });

        Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);

        softBody.label = 'Soft Body';

        return softBody
    }

}