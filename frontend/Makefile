# AWS アクセスポータルのアクセスキーで AWS 環境変数を設定しておく

WARN_COLOR=\x1b[33;01m
NO_COLOR=\x1b[0m

repo_sub_name := frontend
repo_name := $(shell basename $(shell git config --get remote.origin.url) | cut -d. -f1)
repo_full_name := $(repo_name)/$(repo_sub_name)
git_sha := $(shell git rev-parse --short=7 HEAD)

build_date = $(shell date)
version = $(shell cat VERSION)

arch ?= amd64
region ?= ap-northeast-1
environment ?= development

ifneq ($(filter development,$(environment)),)
	environment_short := dev
	account_id := <dev-account-id>
else
ifneq ($(filter production,$(environment)),)
	environment_short := prd
	account_id := <prd-account-id>
endif
endif

# ECR向け
account_id ?= <dev-account-id>
docker_repo := ${account_id}.dkr.ecr.${region}.amazonaws.com/ehv-frontend

$(warning environment = $(environment))
$(warning account_id = $(account_id))

# 本番向け install
ci:
	npm ci --unsafe-perm

# 開発向け install
install:
	npm install --unsafe-perm

clean:
	npm run clean:all

build: viewer-build docker-build save

viewer-build:
	rm -rf docker-cache
	npm run build --unsafe-perm
	sh scripts/buildModule.sh
	npm run build:production

docker-build: docker-login
	docker build -t ${repo_full_name}:${git_sha}-${environment_short} .
	docker tag ${repo_full_name}:${git_sha}-${environment_short} ${repo_full_name}:latest

docker-login:
	aws ecr get-login-password --region ${region} |\
	docker login --username AWS --password-stdin ${account_id}.dkr.ecr.${region}.amazonaws.com

save:
	mkdir -p docker-cache
	docker save \
	-o docker-cache/built-image.tar ${repo_full_name}:${git_sha}-${environment_short}

load:
	docker load \
	-i docker-cache/built-image.tar

push: docker-login load
	docker tag ${repo_full_name}:${git_sha}-${environment_short} ${docker_repo}:${git_sha}-${environment_short}
	docker push ${docker_repo}:${git_sha}-${environment_short}
