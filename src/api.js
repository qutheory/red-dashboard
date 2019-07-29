import axios from 'axios'

var apiBaseURL = process.env.VUE_APP_API_URL
var httpBaseURL = `https://${apiBaseURL}/v1/`
var wsBaseURL = `wss://${apiBaseURL}/v1/`

var api = axios.create({
  baseURL: httpBaseURL,
})

var headers = {}
api.interceptors.request.use(request => {
  for (var name in headers) {
    if (headers[name]) {
      request.headers.common[name] = headers[name]
    }
  }
  return request
}, error => {
  /* eslint-disable */
  console.log(error)
  /* eslint-enable */
})

api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.data && error.response.data.error === true) {
    return Promise.reject(new Error(error.response.data.reason))
  } else {
    return Promise.reject(error)
  }
})

export default {
  headers: headers,
  me() {
    return api.get('/users/me')
      .then(res => res.data)
  },
  verifyAccount(data) {
    return api.post('/users/verify', data)
      .then(res => res.data)
  },
  login(data) {
    return api.post('/users/login', null, {
      headers: { 
        'Authorization': 'Basic ' + btoa(data.email + ':' + data.password) 
      }
    }).then(res => res.data).catch(err => {
      if (err.message.includes('auth')) {
        throw new Error('Invalid email or password.')
      } else {
        throw err
      }
    })
  },
  resetPassword: {
    request(data) {
      return api.post('/reset-password', data)
        .then(res => res.data) 
    },
    complete(data) {
      return api.patch('/reset-password', data)
        .then(res => res.data) 
    }
  },
  users: {
    updatePassword(data) {
      return api.patch('/users/update-password', data)
        .then(res => res.data) 
    }
  },
  logout() {
    return api.post('/users/logout')
      .then(res => res.data)
  },
  switchCompany(id) {
    return api.post('/users/switch-company', {
      companyID: id
    }).then(res => res.data)
  },
  companies: {
    show(id) {
      return api.get('/companies/' + id)
        .then(res => res.data)
    },
    view() {
      return api.get('/companies/view')
        .then(res => res.data)
    },
    index() {
      return api.get('/companies')
        .then(res => res.data)
    },
    create(data) {
      return api.post('/companies', data)
        .then(res => res.data)
    },
    capacity(feature) {
      return api.get('/companies/capacity?feature=' + feature)
        .then(res => res.data)
    },
    invites: {
      index() {
        return api.get('/companies/members')
          .then(res => res.data)
      },
      create(data) {
        return api.post('/companies/invites', data)
          .then(res => res.data)
      },
      delete(id) {
        return api.delete('/companies/members/delete/' + id)
          .then(res => res.data)
      }
    }
  },

  credentials: {  
    index(provider) {
      return api.get('/provider?provider=' + provider)
        .then(res => res.data)
    },
    create(data) {
      return api.post('/provider', data)
        .then(res => res.data)
    },
    delete(id) {
      return api.delete('/provider/' + id)
        .then(res => res.data)
    }
  },

  sizes: {  
    index(provider) {
      return api.get('/sizes?provider=' + provider)
        .then(res => res.data)
    },
  },

  regions: {  
    show(id) {
      return api.get('/regions/' + id)
        .then(res => res.data)
    },
    index(provider) {
      return api.get('/regions?provider=' + provider)
        .then(res => res.data)
    },
  },

  vpcs: {
    index(providerID, regionID) {
      return api.get('/aws/vpcs?providerID=' + providerID + '&regionID=' + regionID)
        .then(res => res.data)
    }
  },
  azss: {
    index(providerID, regionID) {
      return api.get('/aws/azs?providerID=' + providerID + '&regionID=' + regionID)
        .then(res => res.data)
    }
  },
  subnets: {
    index(providerID, regionID, vpcID) {
      return api.get('/aws/subnets?providerID=' + providerID + '&vpcID=' + vpcID + '&regionID=' + regionID)
        .then(res => res.data)
    }
  },

  signup(data) {
    return api.post('/users', data)
      .then(res => res.data)
  },

  createServer(data) {
    return api.post('/servers', data)
      .then(res => res.data)
  },

  serverApps(id) {
    return api.get('/servers/' + id + '/apps')
      .then(res => res.data)
  },

  app(id) {
    return api.get('/apps/' + id)
      .then(res => res.data)
  },

  databaseServers(id) {
    return {
      show() {
        return api.get('/database-servers/' + id)
          .then(res => res.data)
      },
      delete() {
        return api.delete('/database-servers/' + id)
          .then(res => res.data)
      },
      databases: {
        index() {
          return api.get('/database-servers/' + id + '/databases')
            .then(res => res.data)
        },
        create(data) {
          return api.post('/database-servers/' + id + '/databases', data)
            .then(res => res.data)
        },
      }
    }
  },
  databases(id) {
    return {
      show() {
        return api.get('/databases/' + id)
          .then(res => res.data)
      },
    }
  },

  server(id) {
    return {
      show() {
        return api.get('/servers/' + id)
          .then(res => res.data)
      },
      redis: {
        show() {
          return api.get('/servers/' + id + '/redis')
            .then(res => res.data)
        },
        create(data) {
          return api.post('/servers/' + id + '/redis', data)
            .then(res => res.data)
        }
      }
    }
  },
  redis(id) {
    return {
      delete() {
        return api.delete('/redis/' + id)
          .then(res => res.data)
      }
    }
  },

  servers: {
    index() {
      return api.get('/servers/')
        .then(res => res.data)
    },
    show(id) {
      return api.get('/servers/' + id)
        .then(res => res.data)
    },
    delete(id) {
      return api.delete('/servers/' + id)
        .then(res => res.data)
    },
    apps(id) {
      return {
        index() {
          return api.get('/servers/' + id + '/apps')
            .then(res => res.data)
        },
        create(data) {
          return api.post('/servers/' + id + '/apps', data)
            .then(res => res.data)
        }
      }
    },
    networks(id) {
      return {
        index() {
          return api.get('/servers/' + id + '/networks')
            .then(res => res.data)
        },
        create(data) {
          return api.post('/servers/' + id + '/networks', data)
            .then(res => res.data)
        },
        delete(id) {
          return api.delete('/networks/' + id)
            .then(res => res.data)
        }
      }
    },
    databaseServers(id) {
      return {
        index() {
          return api.get('/servers/' + id + '/database-servers')
            .then(res => res.data)
        },
        create(data) {
          return api.post('/servers/' + id + '/database-servers', data)
            .then(res => res.data)
        },
      }
    },
    tools(id) {
      return {
        index() {
          return api.get('/servers/' + id + '/tools')
            .then(res => res.data)
        },
        create(data) {
          return api.post('/servers/' + id + '/tools', data)
            .then(res => res.data)
        }
      }
    },
    provisions(id) {
      return {
        index() {
          return api.get('/servers/' + id + '/provisions')
            .then(res => res.data)
        },
      }
    },
  },

  provisions: {
    logs(id, onmessage) {
      var socket = new WebSocket(wsBaseURL + 'v1/provisions/' + id + '/logs')
      socket.onmessage = (e) => { onmessage(e.data) }
      return socket
    },
    show(id) {
      return api.get('/provisions/' + id)
        .then(res => res.data)
    }
  },

  nginxSites: {
    show(id) {
      return api.get('/nginx-sites/' + id)
        .then(res => res.data)
    },
    update(id, data) {
      return api.patch('/nginx-sites/' + id, data)
        .then(res => res.data)
    },
    delete(id) {
      return api.delete('/nginx-sites/' + id)
        .then(res => res.data)
    },
    tls(id) {
      return {    
        create(data = {}) {
          return api.post('/nginx-sites/' + id + '/tls', data)
            .then(res => res.data)
        },
        delete() {
          return api.delete('/nginx-sites/' + id + '/tls')
            .then(res => res.data)
        }
      }
    }
  },

  tools: {
    index() {
      return api.get('/tools')
        .then(res => res.data)
    },
    show(id) {
      return api.get('/tools/')
        .then(res => {
          return res.data.filter(tool => tool.id == id)[0]
        })
    }
  },

  frameworks: {
    index() {
      return api.get('/frameworks')
        .then(res => res.data)
    },
    show(id) {
      return api.get('/frameworks/')
        .then(res => {
          return res.data.filter(frameworks => frameworks.id == id)[0]
        })
    }
  },

  apps: {
    index() {
      return api.get('/apps/')
        .then(res => res.data)
    },
    show(id) {
      return api.get('/apps/' + id)
        .then(res => res.data)
    },
    update(id, data) {
      return api.patch('/apps/' + id, data)
        .then(res => res.data)
    },
    delete(id) {
      return api.delete('/apps/' + id)
        .then(res => res.data)
    },
    supervisorCommands(appID) {
      return {
        index() {
          return api.get('/apps/' + appID + '/supervisor-commands')
          .then(res => res.data)
        },
        create(data) {
          return api.post('/apps/' + appID + '/supervisor-commands', data)
          .then(res => res.data)
        },
      }
    },
    docker(appID) {
      return {
        index() {
          return api.get('/apps/' + appID + '/docker')
            .then(res => res.data)
        },
        view(id) {
          return api.get('/docker/' + id)
            .then(res => res.data)
        },
        create(data) {
          return api.post('/apps/' + appID + '/docker', data)
            .then(res => res.data)
        },
        delete(id) {
          return api.delete('/docker/' + id)
            .then(res => res.data)
        },
        stats() {
          return api.get('/apps/' + appID + '/docker-stats')
            .then(res => res.data)
        },
        update(id, data) {
          return api.patch('/docker/' + id, data)
            .then(res => res.data)
        }
      }
    },
    nginxSites(appID) {
      return {
        index() {
          return api.get('/apps/' + appID + '/nginx-sites')
            .then(res => res.data)
        },
        create(data) {
          return api.post('/apps/' + appID + '/nginx-sites', data)
            .then(res => res.data)
        },
      }
    },
    deployments(appID) {
      return {
        index() {
          return api.get('/apps/' + appID + '/deployments')
            .then(res => res.data)
        },
        create(data) {
          return api.post('/apps/' + appID + '/deployments', data)
            .then(res => res.data)
        },
      }
    },
  },

  billing: {
    paymentMethods() {
      return {
        index() {
          return api.get('/billing/payment-methods')
            .then(res => res.data)
        },
        create(data) {
          return api.post('/billing/payment-methods', data)
            .then(res => res.data)
        },
        delete(id) {
          return api.delete('/billing/payment-methods/' + id)
        }
      }
    },
    history() {
      return {
        index() {
          return api.get('/billing/history')
            .then(res => res.data)
        }
      }
    },
    plan() {
      return {
        switchPlan(data) {
          return api.post('/billing/switch-plan', data)
            .then(res => res.data)
        }
      }
    }
  },

  deployments: {
    logs(id, onmessage) {
      var socket = new WebSocket(wsBaseURL + 'deployments/' + id + '/logs')
      socket.onmessage = (e) => { onmessage(e.data) }
      return socket
    },
  },

  docker: {
    stats(id, onmessage) {
      var socket = new WebSocket(wsBaseURL + 'apps/' + id + '/docker-stats')
      socket.onmessage = (e) => { onmessage(e.data) }
      return socket
    },
    logs(id, onmessage) {
      var socket = new WebSocket(wsBaseURL + 'docker/' + id + '/logs')
      socket.onmessage = (e) => { onmessage(JSON.parse(e.data)) }
      return socket
    },
  },

  supervisorCommands: {
    show(id) {
      return api.get('/supervisor-commands/' + id)
        .then(res => res.data)
    },
    delete(id) {
      return api.delete('/supervisor-commands/' + id)
        .then(res => res.data)
    },
    logs(id, onmessage) {
      var socket = new WebSocket(wsBaseURL + 'supervisor-commands/' + id + '/logs')
      socket.onmessage = (e) => { onmessage(JSON.parse(e.data)) }
      return socket
    },
  },

  deploy(appID, id) {
    return api.get('/deployments/' + id)
      .then(res => res.data)
  },
  deployLogs(id) {
    return api.get('/deployments/' + id + '/logs')
      .then(res => res.data)
  },

  serverKeys(id) {
    return api.get('/servers/' + id + '/keys')
      .then(res => res.data)
  },
  createServerKey(id, key) {
    return api.post('/servers/' + id + '/keys', key)
      .then(res => res.data)
  },
  deleteServerKey(id) {
    return api.delete('/keys/' + id)
      .then(res => res.data)
  }
}
