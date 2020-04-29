// Constants

local STAGING_EC2_HOST = "ec2-52-20-46-100.compute-1.amazonaws.com";
local PRODUCTION_EC2_HOST = "ec2-34-194-213-141.compute-1.amazonaws.com";
local ECR_REGISTRY = "074552482398.dkr.ecr.us-east-1.amazonaws.com";

local publishDockerImage(app, env, when) = {
  "name": "publish " + env + " to ECR",
  "image": "plugins/ecr",
  "when": when,
  "settings": {
    "dockerfile": "./" + app + "/Dockerfile",
    "context": "./" + app,
    "build_args": [
      "ENV=" + env
    ],
    "access_key": {
      "from_secret": "AWS_ACCESS_KEY_ID"
    },
    "secret_key": {
      "from_secret": "AWS_SECRET_ACCESS_KEY"
    },
    "region": "us-east-1",
    "registry": ECR_REGISTRY,
    "repo": "rolocha/" + app,
    "tags": [
      env + "-latest"
    ],
  },
};

local deployEC2(env, host, when) = {
  "name": "deploy " + env,
  "image": "appleboy/drone-ssh",
  "when": when,
  "settings": {
    "host": host,
    "username": "ubuntu",
    "key": {
      "from_secret": "rolocha_ssh_key"
    },
    "port": 22,
    "envs": [
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "AWS_DEFAULT_REGION"
    ],
    "script": [
      "cd ~/rolocha-web",
      "make deploy"
    ],
  },
};

local installNodeModules(app, when) = {
  "name": "install dependencies",
  "image": "node:12",
  "when": when,
  "commands": [
    "cd " + app,
    "yarn install --production=false",
  ],
};

local test(app, when) = {
  "name": "test",
  "image": "node:12",
  "when": when,
  "commands": [
    "cd " + app,
    "yarn test"
  ],
};

local build(app, when) = {
  "name": "build client",
  "image": "node:12",
  "when": when,
  "commands": [
    "cd " + app,
    "yarn install --production=false",
    "yarn build"
  ]
};

local syncToBucket(when) = {
  "name": "deploy client to S3",
  "image": "plugins/s3-sync:1",
  "when": when,
  "settings": {
    "bucket": "stage.rolocha.com",
    "access_key": {
      "from_secret": "AWS_ACCESS_KEY_ID"
    },
    "secret_key": {
      "from_secret": "AWS_SECRET_ACCESS_KEY",
    },
    "source": "client/build",
    "target": "/",
    "delete": true
  },
};

local updateDeployConfig(env, host, when) = {
  "name": "update deployment config",
  "image": "node:12",
  "when": when,
  "environment": {
    "SSH_KEY": {
      "from_secret": "rolocha_ssh_key"
    },
  },
  "commands": [
    "mkdir ~/.ssh",
    "echo \"$${SSH_KEY}\" > ~/.ssh/id_rsa",
    "chmod 600 ~/.ssh/id_rsa",
    "scp -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa .devops/" + env + "/* ubuntu@" + host + ":~/rolocha-web",
    "rm ~/.ssh/id_rsa"
  ],
};

// Deployment conditionals
local STAGING_DEPLOY_CONDITION = { "event": "custom", "branch": "${ROLOCHA_DEPLOY_BRANCH}" };
local PRODUCTION_DEPLOY_CONDITION = { "branch": ["production"] };
local ALWAYS_CONDITION = {};


// Pipelines begin here

[
  {
    "kind": "pipeline",
    "type": "docker",
    "name": "client",
    "steps": [
      installNodeModules("client", ALWAYS_CONDITION),
      test("client", ALWAYS_CONDITION),
      build("client", STAGING_DEPLOY_CONDITION),
      syncToBucket(STAGING_DEPLOY_CONDITION)
    ],
    "trigger": {
      "event": {
        "include": [
          "push",
          "custom"
        ]
      },
    },
  },

  {
    "kind": "pipeline",
    "type": "docker",
    "name": "server",
    "steps": [
      publishDockerImage("server", "staging", STAGING_DEPLOY_CONDITION),
      updateDeployConfig("staging", STAGING_EC2_HOST, STAGING_DEPLOY_CONDITION),
      deployEC2("staging", STAGING_EC2_HOST, STAGING_DEPLOY_CONDITION),
    ],
    "trigger": {
      "event": {
        "include": [
          "push",
          "custom"
        ]
      },
    },
  }
]
