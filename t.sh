#!/bin/bash
# start_xbindkeys.sh

# Créer le fichier de configuration xbindkeys s'il n'existe pas
if [ ! -f ~/.xbindkeysrc ]; then
    touch ~/.xbindkeysrc
    echo '"xdotool type "intra.42.fr"'
    echo '    F1' >> ~/.xbindkeysrc
fi

# Démarrer xbindkeys
xbindkeys