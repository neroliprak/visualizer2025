import s from "./Landing.module.scss";
import AudioController from "../../utils/AudioController";
import { useState } from "react";
import Button from "../Button/Button";

// Page d'accueil
const Landing = () => {
  const [hasClicked, setHasClicked] = useState(false);

  const onClick = () => {
    AudioController.setup();
    setHasClicked(true);
  };

  return (
    <section className={`${s.landing} ${hasClicked ? s.landingHidden : ""}`}>
      <div className={s.wrapper}>
        <h1 className={s.title}>Visualizer</h1>
        <p>
          Projet conçu dans le cadre du cours Dispositifs interactifs à l'IUT de
          Champs-sur-Marne. <br />
          Découverte et usage de three.js, gsap, react, la Web Audio API. <br />
          Importez vos fichiers mp3 pour pouvoir les visualiser en 3D.
        </p>
        <ul class={s.list}>
          <li>Ajout d'un objet 3D (+fontcionnalités)</li>
          <li>Ouverture du Tracklist avec "TAB"</li>
          <li>État actif sur la liste des tracks</li>
          <li>Mettre un btn pause/play</li>
          <li>"ENTER" sur la track pour jouer la musique</li>
          <li>Select d'une track avec les flèches du clavier</li>
          <li>Mettre un btn avance et recule de 5sc</li>
          <li>Mettre un btn loop</li>
          <li>Mettre un btn track précédente / suivante</li>
          <li>Navigation dans la timeline</li>
          <li>Ajout couleur scrollbar</li>
          <li>Affichage de la track en cours, la cover, l'artiste</li>
          <li>Reset de la barre de recherche de deezer</li>
          <li>
            La musique passent automatiquement à la musique suivante à la fin
          </li>
          <li>Un bouton aléatoire sur la liste des tracks</li>
          <li>Like local</li>
        </ul>

        <Button label={"Commencer"} onClick={onClick} />
      </div>
    </section>
  );
};

export default Landing;
