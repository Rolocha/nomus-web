.PHONY: ecr-login clean pull start stop deploy

ECR_URL=074552482398.dkr.ecr.us-east-1.amazonaws.com

ecr-login:
	# Authorize Docker to access AWS Elastic Container Service
	# https://docs.aws.amazon.com/cli/latest/reference/ecr/get-login.html
	aws ecr get-login-password | docker login --username AWS --password-stdin $(ECR_URL)

clean:
	docker image prune --force
	docker volume prune --force

pull: ecr-login
	docker-compose pull

start:
	docker-compose up -d

stop:
	docker-compose down

deploy: clean pull stop start