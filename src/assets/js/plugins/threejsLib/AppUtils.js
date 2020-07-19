var AppUtils = {

  normalizeRotation: function (object, axis) {
    return THREE.Math.degToRad(
      THREE.Math.radToDeg(object.rotation[axis]) % 360
    );
  },

  disposeObject3D: function (model) {
    var i;
    if (model.parent) {
      for (i = model.parent.children.length - 1; i >= 0; i--) {
        model.parent.children[i].traverse(traverseFunc);
      }
      AppUtils.clearThree(model.parent);
    } else {
      for (i = model.children.length - 1; i >= 0; i--) {
        model.children[i].traverse(traverseFunc);
      }
      AppUtils.clearThree(model);
    }

    model = null;

    function traverseFunc(child) {
      if (child.isMesh) {
        AppUtils.disposeHierarchy(child, AppUtils.disposeNode);
      }
    }
  },

  disposeNode: function (node) {
    if (node instanceof THREE.Mesh) {
      if (node.geometry) {
        node.geometry.dispose();
      }

      if (node.material) {
        if (node.material instanceof THREE.MeshFaceMaterial) {
          $.each(node.material.materials, function (idx, mtrl) {
            if (mtrl.map) mtrl.map.dispose();
            if (mtrl.lightMap) mtrl.lightMap.dispose();
            if (mtrl.bumpMap) mtrl.bumpMap.dispose();
            if (mtrl.normalMap) mtrl.normalMap.dispose();
            if (mtrl.specularMap) mtrl.specularMap.dispose();
            if (mtrl.envMap) mtrl.envMap.dispose();

            mtrl.dispose(); // disposes any programs associated with the material
          });
        } else {
          if (node.material.map) node.material.map.dispose();
          if (node.material.lightMap) node.material.lightMap.dispose();
          if (node.material.bumpMap) node.material.bumpMap.dispose();
          if (node.material.normalMap) node.material.normalMap.dispose();
          if (node.material.specularMap) node.material.specularMap.dispose();
          if (node.material.envMap) node.material.envMap.dispose();

          node.material.dispose(); // disposes any programs associated with the material
        }
      }
    }
  }, // disposeNode

  disposeHierarchy: function (node, callback) {
    for (var i = node.children.length - 1; i >= 0; i--) {
      var child = node.children[i];
      AppUtils.disposeHierarchy(child, callback);
      callback(child);
    }
  },

  clearThree: function (obj) {
    while (obj.children.length > 0) {
      AppUtils.clearThree(obj.children[0]);
      obj.remove(obj.children[0]);
    }
    if (obj.geometry) {
      obj.geometry.dispose();
      if (obj.geometry.vertices) obj.geometry.vertices = [];
    }
    if (obj.material)
      if (obj.material.length > 0) {
        for (var j = 0; j < obj.material.length; j++) {
          obj.material[j].dispose();
        }
      } else obj.material.dispose();
    if (obj.texture) obj.texture.dispose();
    obj = null;
  }
};


Object.assign(THREE.Object3D.prototype, {

  clearChild: function () {
    var _this = this;
    AppUtils.clearThree(_this);
  },

  removeObjectByProperty: function (nameProperty, value, isRemoveCurrentObject) {
    var _this = this;

    isRemoveCurrentObject = typeof isRemoveCurrentObject == "undefined" ? false : isRemoveCurrentObject;

    if (isRemoveCurrentObject)
      if (_this[nameProperty] == value) {
        _this.parent.remove(_this);
        AppUtils.clearThree(_this);
        return;
      }

    for (var i = _this.children.length - 1; i >= 0; i--) {
      _this.children[i].removeObjectByProperty(nameProperty, value, true);
    }
  },

  removeObjectByName: function (name, isRemoveCurrentObject) {

    isRemoveCurrentObject = typeof isRemoveCurrentObject == "undefined" ? false : isRemoveCurrentObject;

    this.removeObjectByProperty("name", name, isRemoveCurrentObject);
  },

  removeObjectById: function (name, isRemoveCurrentObject) {

    isRemoveCurrentObject = typeof isRemoveCurrentObject == "undefined" ? false : isRemoveCurrentObject;

    this.removeObjectByProperty("id", name, isRemoveCurrentObject);
  },


})


