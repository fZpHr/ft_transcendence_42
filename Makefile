CONFIG_FILE = dev_tools/.make_config

ifneq ("$(wildcard $(CONFIG_FILE))","")
    include $(CONFIG_FILE)
endif

ASCII_ART = "▄▄▄▖▗▄▄▖  ▗▄▖ ▗▖  ▗▖ ▗▄▄▖ ▗▄▄▖▗▄▄▄▖▗▖  ▗▖▗▄▄▄ ▗▄▄▄▖▗▖  ▗▖ ▗▄▄▖▗▄▄▄▖\n\
              █  ▐▌ ▐▌▐▌ ▐▌▐▛▚▖▐▌▐▌   ▐▌   ▐▌   ▐▛▚▖▐▌▐▌  █▐▌   ▐▛▚▖▐▌▐▌   ▐▌   \n\
              █  ▐▛▀▚▖▐▛▀▜▌▐▌ ▝▜▌ ▝▀▚▖▐▌   ▐▛▀▀▘▐▌ ▝▜▌▐▌  █▐▛▀▀▘▐▌ ▝▜▌▐▌   ▐▛▀▀▘\n\
              █  ▐▌ ▐▌▐▌ ▐▌▐▌  ▐▌▗▄▄▞▘▝▚▄▄▖▐▙▄▄▖▐▌  ▐▌▐▙▄▄▀▐▙▄▄▖▐▌  ▐▌▝▚▄▄▖▐▙▄▄▖\n\
                                                                    "

VERSION_LAUNCH = 0

all:
	@echo $(ASCII_ART)
	@make -s check-config
	@make -s start

down: 
	@if [ "$(VERSION)" = "dev" ]; then \
        if [ "$(SHOW_DETAILS)" = "1" ]; then \
            docker compose --env-file .env -f dev_tools/docker-compose-dev.yml down; \
        else \
            docker compose --env-file .env -f dev_tools/docker-compose-dev.yml down > /dev/null 2>&1; \
        fi \
	elif [ "$(VERSION)" = "prod" ]; then \
        if [ "$(SHOW_DETAILS)" = "1" ]; then \
            docker compose -f docker-compose.yml down; \
			docker system prune -a -f; \
			docker volume prune -f; \
			docker network prune -f; \
        else \
			echo "Arrêt des services..."; \
            docker compose down > /dev/null 2>&1; \
			docker system prune -a -f > /dev/null 2>&1; \
			docker volume prune -f > /dev/null 2>&1; \
			docker network prune -f > /dev/null 2>&1; \
        fi \
    fi


re:
	@make -s down
	@make -s all

start:
	make -s env
	@if [ "$(VERSION)" = "dev" ] && [ "$(SHOW_DETAILS)" = "1" ]; then \
        docker compose --env-file .env -f dev_tools/docker-compose-dev.yml up --build; \
    elif [ "$(VERSION)" = "prod" ] && [ "$(SHOW_DETAILS)" = "1" ]; then \
        docker compose up --build; \
	elif [ "$(VERSION)" = "dev" ] && [ "$(SHOW_DETAILS)" = "0" ]; then \
		docker compose --env-file .env -f dev_tools/docker-compose-dev.yml up --build -d; \
	elif [ "$(VERSION)" = "prod" ] && [ "$(SHOW_DETAILS)" = "0" ]; then \
		docker compose up --build -d; \
    fi

env:
	@if [ ! -f .env ] || [ ! -s .env ]; then \
		echo "Environement pas trouvé ou vide, création de l'environnement..."; \
        sudo chmod -R 777 ./data/*; \
        touch .env; \
        docker compose -f dev_tools/docker-compose-env.yml up --build; \
        docker compose -f dev_tools/docker-compose-env.yml down; \
        docker system prune -a -f; \
        docker network prune -f; \
    else \
        echo "Environment already created"; \
    fi


### Development part ###

env-modif:
	@sudo chmod -R 777 ./data/*
	@docker compose -f dev_tools/docker-compose-expose-vault.yml up --build -d
	@sudo docker inspect vault | grep "\"IPAddress\": \"1" | awk '{print $$2}' | sed 's/^\"//;s/\",$$//' | awk '{print "http://" $$0 ":8200"}'

env-down:
	@-docker compose -f dev_tools/docker-compose-expose-vault.yml down
	@docker system prune -a -f
	@docker volume prune -f
	@docker network prune -f

req:
	@-sudo apt-get remove docker docker-engine docker.io containerd runc docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
	@sudo apt-get autoremove -y
	@sudo apt-get update
	@sudo apt-get install ca-certificates curl -y
	@sudo install -m 0755 -d /etc/apt/keyrings
	@sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
	@sudo chmod a+r /etc/apt/keyrings/docker.asc
	@echo "deb [arch=$$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $$(. /etc/os-release && echo "$$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
	@sudo apt-get update
	@sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

check-config:
	@if [ ! -f $(CONFIG_FILE) ]; then \
        echo "Configuration non trouvée. Veuillez définir les options."; \
        $(MAKE) options; \
	fi \


### Options part ###

options-version:
	@while true; do \
		read -p "Voulez-vous afficher les détails des commandes ? (y/n) " show_details; \
		if [ "$$show_details" = "y" ]; then \
			echo "SHOW_DETAILS=1" > $(CONFIG_FILE); \
			break; \
		elif [ "$$show_details" = "n" ]; then \
			echo "SHOW_DETAILS=0" > $(CONFIG_FILE); \
			break; \
		else \
			echo "Choix invalide. Veuillez choisir 'y' ou 'n'."; \
		fi; \
    done; \

options-details:
	@while true; do \
        read -p "Voulez-vous lancer la version de développement ou de production ? (dev/prod) " version; \
        if [ "$$version" = "dev" ]; then \
            echo "VERSION=dev" >> $(CONFIG_FILE); \
            break; \
        elif [ "$$version" = "prod" ]; then \
            echo "VERSION=prod" >> $(CONFIG_FILE); \
            break; \
        else \
            echo "Choix invalide. Veuillez choisir 'dev' ou 'prod'."; \
        fi; \
    done; \

options:
	@$(MAKE) -s options-version
	@$(MAKE) -s options-details
	@echo "Options enregistrées dans $(CONFIG_FILE)."
	@echo "Pour modifier les options ultérieurement, veuillez exécuter 'make options' ou modifier directement le fichier $(CONFIG_FILE)."




.PHONY: all down re start env env-modif env-down req check-config options options-version options-details