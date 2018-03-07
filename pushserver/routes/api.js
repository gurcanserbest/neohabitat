const fs = require('fs');

const express = require('express');
const log = require('winston');
const showdown = require('showdown');


class APIRoutes {
  constructor(habiproxy, config) {
    this.habiproxy = habiproxy;
    this.config = config;
    this.router = express.Router();
    this.setRoutes();
  }

  setRoutes() {
    var self = this;

    self.router.get('/avatar/:avatarName', function(req, res, next) {
      if (req.params.avatarName in self.habiproxy.sessions) {
        res.json(self.habiproxy.sessions[req.params.avatarName].avatarObj);
      } else {
        res.error('Avatar not found.');
      }
    });

    self.router.get('/avatar/:avatarName/health', function(req, res, next) {
      if (req.params.avatarName in self.habiproxy.sessions) {
        res.json({health: self.habiproxy.sessions[req.params.avatarName].avatarHealth()});
      } else {
        res.error('Avatar not found.');
      }
    });

    self.router.get('/avatar/:avatarName/region', function(req, res, next) {
      if (req.params.avatarName in self.habiproxy.sessions) {
        res.json(self.habiproxy.sessions[req.params.avatarName].regionContents);
      } else {
        res.error('Avatar not found.');
      }
    });

    self.router.get('/worldview/avatars', function(req, res, next) {
      var awakeSessions = self.habiproxy.awakeSessions();
      var avatarNames = Object.keys(awakeSessions).sort();
      var avatarWorldview = {
        totalAvatars: avatarNames.length,
        avatars: [],
      };
      for (var i in avatarNames) {
        var avatarName = avatarNames[i];
        var avatarLocation = awakeSessions[avatarName].avatarContext.name;
        avatarWorldview.avatars.push({avatar: avatarName, location: avatarLocation});
      }
      res.json(avatarWorldview);
    });
  }
}

module.exports = APIRoutes;
