include .env
export

.PHONY: up down

up:
	docker-compose up -d

down:
	docker-compose down

clone-db-to-staging:
	docker exec -i db bash < ./.devops/clone_local_db_to_staging.sh