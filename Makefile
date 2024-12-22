all: up

up:
	docker-compose -f ./docker-compose.yml up --build

down:
	docker-compose -f ./docker-compose.yml down

clean:
	@if [ $$(docker ps -q | wc -l) -gt 0 ]; then \
		echo "Stopping running containers..."; \
		docker stop $$(docker ps -q); \
	fi

fclean: clean
	@if [ $$(docker ps -qa | wc -l) -gt 0 ]; then \
		echo "Removing containers..."; \
		docker rm $$(docker ps -qa); \
	fi
	@if [ $$(docker volume ls -q | wc -l) -gt 0 ]; then \
		echo "Removing volumes..."; \
		docker volume rm $$(docker volume ls -q); \
	fi
	@if [ $$(docker images -q | wc -l) -gt 0 ]; then \
		echo "Removing images..."; \
		docker rmi -f $$(docker images -q); \
	fi

re:
	@$(MAKE) down
	@$(MAKE) up

.PHONY: all up down clean fclean re
