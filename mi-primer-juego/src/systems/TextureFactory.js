export class TextureFactory {
  static createBootTextures(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x040a14, 1);
    g.fillRect(0, 0, 64, 64);
    g.generateTexture('bg_base', 64, 64);
    g.destroy();
  }

  static createGameTextures(scene) {
    // 1. Sprite Cenital del Submarino Amarillo (apuntando a la derecha: 0 rad)
    const sub = scene.make.graphics({ x: 0, y: 0, add: false });

    // Hélice trasera y eje (Popa - izquierda)
    sub.fillStyle(0x64748b, 1);
    sub.fillRect(6, 19, 6, 6);
    sub.fillStyle(0x94a3b8, 1);
    sub.fillRect(2, 12, 4, 20); // Aspas de la hélice

    // Aletines estabilizadores traseros
    sub.fillStyle(0xb45309, 1);
    sub.fillTriangle(10, 22, 18, 6, 22, 22);
    sub.fillTriangle(10, 22, 18, 38, 22, 22);

    // Hidroplanos delanteros (aletines de inmersión a los lados)
    sub.fillStyle(0xd97706, 1);
    sub.fillRoundedRect(36, 4, 10, 36, 3);

    // Casco exterior de presión (Sombra ámbar/mostaza)
    sub.fillStyle(0xca8a04, 1);
    sub.fillRoundedRect(10, 9, 50, 26, 13);

    // Casco principal (Amarillo submarino brillante para alto contraste)
    sub.fillStyle(0xfacc15, 1);
    sub.fillRoundedRect(13, 11, 45, 22, 11);

    // Cúpula de observación frontal en la proa (Cristal reforzado cian)
    sub.fillStyle(0x0284c7, 1);
    sub.fillCircle(50, 22, 7);
    sub.fillStyle(0x38bdf8, 1);
    sub.fillCircle(52, 20, 3); // Reflejo del cristal

    // Torreta central (Vela del submarino) y escotilla
    sub.fillStyle(0xca8a04, 1);
    sub.fillRoundedRect(24, 15, 18, 14, 6);
    sub.fillStyle(0xfde047, 1);
    sub.fillRoundedRect(26, 16, 14, 12, 5);

    // Escotilla superior y tubo del periscopio
    sub.fillStyle(0x475569, 1);
    sub.fillCircle(31, 22, 4);
    sub.fillStyle(0xe2e8f0, 1);
    sub.fillCircle(36, 22, 2); // Periscopio

    // Focos halógenos delanteros en la proa
    sub.fillStyle(0xfef08a, 1);
    sub.fillCircle(57, 14, 2.5);
    sub.fillCircle(57, 30, 2.5);

    sub.generateTexture('sonda', 64, 44);
    sub.destroy();

    // 2. Formación rocosa abisal
    const rock = scene.make.graphics({ x: 0, y: 0, add: false });
    rock.fillStyle(0x0f172a, 1);
    rock.fillCircle(28, 28, 26);
    rock.lineStyle(3, 0x1e293b, 1);
    rock.strokeCircle(28, 28, 25);
    rock.fillStyle(0x14b8a6, 0.5);
    rock.fillCircle(22, 22, 6);
    rock.generateTexture('roca', 56, 56);
    rock.destroy();

    // 3. Criatura abisal (Leviatán)
    const mob = scene.make.graphics({ x: 0, y: 0, add: false });
    mob.fillStyle(0x4c1d95, 1);
    mob.fillCircle(20, 20, 16);
    mob.fillStyle(0xf43f5e, 1);
    mob.fillCircle(26, 14, 4);
    mob.fillCircle(26, 26, 4);
    mob.fillStyle(0x2dd4bf, 1);
    mob.fillCircle(34, 20, 3);
    mob.generateTexture('leviatan', 40, 40);
    mob.destroy();
  }
}