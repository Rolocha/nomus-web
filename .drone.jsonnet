// Constants

local STAGING_EC2_HOST = "ec2-52-20-46-100.compute-1.amazonaws.com";
local PRODUCTION_EC2_HOST = "ec2-34-194-213-141.compute-1.amazonaws.com";
local ECR_REGISTRY = "074552482398.dkr.ecr.us-east-1.amazonaws.com";

local publishServerDockerImage(env, when) = {
  "name": "publish " + env + " to ECR",
  "image": "plugins/ecr",
  "when": when,
  "settings": {
    "dockerfile": "./server/Dockerfile",
    "context": "./server",
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
    "repo": "nomus/server",
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
      "cd ~/nomus-web",
      "make deploy"
    ],
  },
};

local installNodeModules(app, when) = {
  "name": "install dependencies in " + app,
  "image": "node:12",
  "when": when,
  "commands": [
    "cd " + app,
    "yarn install --production=false",
  ],
};



local runCmd(app, cmd, when) = {
  "name": cmd,
  "image": "node:12",
  "when": when,
  "commands": [
    "cd " + app,
    cmd,
  ],
};

local buildClient(when, deployEnv) = {
  "name": "build " + deployEnv + " client app",
  "image": "node:12",
  "when": when,
  "environment": {
    "DEPLOY_ENV": deployEnv
  },
  "commands": [
    "cd client",
    "yarn install --production=false",
    "yarn build"
  ]
};

local syncToBucket(bucket, region, when) = {
  "name": "sync client bundle to " + bucket,
  "image": "plugins/s3-sync:1",
  "when": when,
  "settings": {
    "bucket": bucket,
    "region": region,
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
  "name": "update " + env + " deployment config",
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
    "scp -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa .devops/" + env + "/* ubuntu@" + host + ":~/nomus-web",
    "rm ~/.ssh/id_rsa"
  ],
};

// Deployment conditionals

// Uncomment this if we want it to deploy based on the /deploy slack command
// local STAGING_DEPLOY_CONDITION = { "event": "custom", "branch": "${NOMUS_DEPLOY_BRANCH}" };

local STAGING_DEPLOY_CONDITION = { "branch": ["master"] };
local PRODUCTION_DEPLOY_CONDITION = { "branch": ["production"] };
local NON_DEPLOY_CONDITION = { 
  "branch": {
    "exclude": ["production", "staging"],
  }
};
local STAGING_OR_PRODUCTION_DEPLOY_CONDITION = { "branch": ["master", "production"] };
local ALWAYS_CONDITION = {};


// Pipelines begin here

[
  {
    "kind": "pipeline",
    "type": "docker",
    "name": "client",
    "steps": [
      installNodeModules("client", ALWAYS_CONDITION),
      runCmd("client", "yarn lint:ci", ALWAYS_CONDITION),
      runCmd("client", "yarn test", ALWAYS_CONDITION),

      buildClient(PRODUCTION_DEPLOY_CONDITION, "production"),
      buildClient(STAGING_DEPLOY_CONDITION, "staging"),
      // We used to only build when we needed the built assets (i.e. when deploying)
      // but this caused there to occasionally be errors that only show up during build time
      // resulting in builds succeeding while the PR is up but then failing once merged into master.
      // Always building causes PR builds to take 1.5+ minutes longer but it's worth it to avoid
      // the annoyance of having builds on master fail unexpectedly.
      buildClient(NON_DEPLOY_CONDITION, "test"),

      // Staging
      syncToBucket("stage.nomus.me", "us-east-1", STAGING_DEPLOY_CONDITION),

      // Production
      syncToBucket("nomus.me", "us-west-1", PRODUCTION_DEPLOY_CONDITION)
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
      installNodeModules("server", ALWAYS_CONDITION),
      runCmd("server", "yarn test", ALWAYS_CONDITION),

      // Staging
      publishServerDockerImage("staging", STAGING_DEPLOY_CONDITION),
      updateDeployConfig("staging", STAGING_EC2_HOST, STAGING_DEPLOY_CONDITION),
      deployEC2("staging", STAGING_EC2_HOST, STAGING_DEPLOY_CONDITION),
      
      // Production
      publishServerDockerImage("production", PRODUCTION_DEPLOY_CONDITION),
      updateDeployConfig("production", PRODUCTION_EC2_HOST, PRODUCTION_DEPLOY_CONDITION),
      deployEC2("production", PRODUCTION_EC2_HOST, PRODUCTION_DEPLOY_CONDITION),
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
