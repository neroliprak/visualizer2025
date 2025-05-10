import * as THREE from "three";
import audioController from "../../utils/AudioController";
import scene from "../Scene";

export default class Trumpet {
  constructor() {
    this.group = new THREE.Group();
    this.geometry = new THREE.BoxGeometry(0.5, 0.2, 0.2);

    // Les palettes de couleurs utilisés
    this.colorsRainbow = [
      0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x8f00ff,
    ];
    this.colorsRed = [
      0xff0000, 0xff7f7f, 0xffcccc, 0xff4d4d, 0xff9999, 0xcc0000,
    ];
    this.colorsBlue = [
      0x0000ff, 0x3333ff, 0x6666ff, 0x99ccff, 0x0066cc, 0x0033cc,
    ];

    this.lines = [];
    this.numLines = 10;
    this.velocity = [];

    // Ajout de matcap
    this.matcap = scene.textureLoader.load("/textures/rainbow-matcap.png");

    // Chargement du modèle 3D
    this.trumpet = null;
    scene.gltfLoader.load("/models/trumpet2.glb", (gltf) => {
      this.trumpet = gltf.scene;
      this.trumpet.scale.set(1, 1, 1);
      this.trumpet.position.set(-6, -4, 0);

      // Application des différents matcaps en fonction du choix
      const whiteMaterial = new THREE.MeshMatcapMaterial({
        matcap: this.matcap,
      });

      this.trumpet.traverse((child) => {
        if (child.isMesh) {
          child.material = whiteMaterial;
        }
      });

      this.group.add(this.trumpet);
    });

    this.setColors(this.colorsRainbow);
  }

  // Changer les couleurs des lignes
  setColors(colors) {
    // Remove les lignes après changement et ajout de nouvelles lignes
    for (let i = 0; i < this.lines.length; i++) {
      this.group.remove(this.lines[i]);
    }
    this.lines = [];

    // Add new lignes avec les couleurs que choisi l'utilisateur (Rouge / Bleu / Tous les couleurs)
    for (let i = 0; i < this.numLines; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
      });
      const mesh = new THREE.Mesh(this.geometry, material);

      // Positionnement & Rotation
      mesh.position.set(40, -200, 50);
      mesh.rotation.z = Math.PI / 12;

      // Vitesse différente pour chaques lignes
      const speed = 0.02 + Math.random() * 0.03;
      this.velocity.push(new THREE.Vector2(speed, speed));

      this.lines.push(mesh);
      this.group.add(mesh);
    }
  }

  // Changer la texture du matériel
  changeMatcap(texturePath) {
    const newMatcap = scene.textureLoader.load(texturePath);

    this.trumpet?.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshMatcapMaterial({
          matcap: newMatcap,
        });
      }
    });
  }

  // Changer la couleur de l'objet 3D
  changeColor(color) {
    if (this.trumpet) {
      this.trumpet.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(color);
        }
      });
    }
  }

  update() {
    if (audioController.fdata) {
      // Mouvement rotation & position de l'objet 3D
      const time = performance.now() * 0.001;
      this.group.rotation.z = Math.sin(time) * 0.1;
      this.group.position.y = Math.sin(time * 1.5) * 0.5;

      for (let i = 0; i < this.lines.length; i++) {
        const audioFrequency =
          audioController.fdata[i % audioController.fdata.length];

        // Modifie l'échelle selon la fréquence de l'audio
        this.lines[i].scale.x = Math.max(1, audioFrequency * 0.1);
        this.lines[i].rotation.z = audioFrequency * 0.001;

        //  Déplacement aléatoire des lignes
        this.lines[i].position.x +=
          this.velocity[i].x + (Math.random() - 0.5) * 0.001;
        this.lines[i].position.y +=
          this.velocity[i].y + (Math.random() - 0.5) * 0.001;

        // Réinitialisation des positions si dépasse seuil
        if (this.lines[i].position.y > 3 || this.lines[i].position.x > 3) {
          this.lines[i].position.set(0.5, -2, 0);
        }
      }
    }
  }
}
