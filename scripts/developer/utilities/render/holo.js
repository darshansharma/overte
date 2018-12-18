"use strict";
//
// holo.js
//
// Created by Sam Gateau on 2018-12-17
// Copyright 2018 High Fidelity, Inc.
//
// Distributed under the Apache License, Version 2.0
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//


(function() {
    // Function Name: inFrontOf()
    //
    // Description:
    //   -Returns the position in front of the given "position" argument, where the forward vector is based off
    //    the "orientation" argument and the amount in front is based off the "distance" argument.
    function inFrontOf(distance, position, orientation) {
        return Vec3.sum(position || MyAvatar.position,
            Vec3.multiply(distance, Quat.getForward(orientation || MyAvatar.orientation)));
    }

    //*****************************************************
    // Holo 
    //*****************************************************

    function Holo(config) {
        this.baseEntityProperties = {
                name: "Holo-base",
                //"collisionless": false,
                "color": {
                    "blue": 239,
                    "green": 180,
                    "red": 0
                },
                "dimensions": {
                    "x": 10,
                    "y": 0.1,
                    "z": 10,
                },
                "grab": {
                    "grabbable": false,
                },
               // "ignoreForCollisions": false,
                type: "Shape",
                shape: "Cylinder",
                shapeType:"box",
                "position": inFrontOf(8, Vec3.sum(MyAvatar.position, { x: 0, y: -1, z: 0 })),
                "rotation": Quat.multiply(MyAvatar.orientation, { w: 0, x: 0, y: 1, z: 0 }),
                lifetime: config.lifetime,
            }
        this.baseEntity = Entities.addEntity( this.baseEntityProperties );
        this.baseEntityProperties = Entities.getEntityProperties(this.baseEntity);

        this.screenEntityProperties = {
            name: "Holo-screen",
            "collisionless": true,
            "color": {
                "blue": 239,
                "red": 180,
                "green": 0
            },
            "dimensions": {
                "x": 5,
                "y": 0.1,
                "z": 5,
            },
            "grab": {
                "grabbable": false,
            },
            "ignoreForCollisions": true,
            type: "Shape",
            shape: "Cylinder",
            "position": inFrontOf(8, Vec3.sum(MyAvatar.position, { x: 0, y: -0.9, z: 0 })),
            "rotation": Quat.multiply(MyAvatar.orientation, { w: 0, x: 0, y: 1, z: 0 }),
            lifetime: config.lifetime,
        }
        this.screenEntity = Entities.addEntity( this.screenEntityProperties );
        this.screenEntityProperties = Entities.getEntityProperties(this.screenEntity);

        var DIM = {x: 5.0, y: 5.0, z: 0.0};

        this.screen = Overlays.addOverlay("image3d", {
            url: "resource://spectatorCameraFrame",
            emissive: true,
            parentID:  this.screenEntity,
            alpha: 1,
            localRotation: { w: 1, x: 0, y: 0, z: 0 },
            localPosition: { x: 0, y: 4.0, z: 0.0 },
            dimensions: DIM,
            lifetime: config.lifetime,
        });
    }

    Holo.prototype.kill = function () {
        if (this.baseEntity) {
            Entities.deleteEntity(this.baseEntity);
           // this.entity = null
        }
        if (this.screenEntity) {
            Entities.deleteEntity(this.screenEntity);
           // this.entity = null
        }
        if (this.screen) {
            Overlays.deleteOverlay(this.view);
        }
    };   

    
    //*****************************************************
    // Exe 
    //*****************************************************

    var holo;

    function shutdown() {
        if (holo) {
            holo.kill();
        }

    }

    function startup() {
        holo = new Holo({ lifetime: 60});
    }

    startup();
    Script.scriptEnding.connect(shutdown);
}());