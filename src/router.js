import Vue from 'vue'
import VueRouter from 'vue-router'

import VRAccount from '@/pages/vr-account'
import VRLogin from '@/pages/vr-login'
import VRRecover from '@/pages/recover'
import VRResetPassword from '@/pages/reset-password'
import VRSignup from '@/pages/vr-signup'
import VRSupport from '@/pages/vr-support'
import VRDashboard from '@/pages/dashboard'
import VRVerifyAccount from '@/pages/verify-account'

import VRServersIndex from '@/pages/servers/index'
import VRServersShow from '@/pages/servers/show'
import VRServersCreate from '@/pages/servers/create'
import VRServersSettings from '@/pages/servers/settings'

import VRServersAppsIndex from '@/pages/servers/apps/index'

import VRServersProvisionsIndex from '@/pages/servers/provisions/index'
import VRServersProvisionsShow from '@/pages/servers/provisions/show'

import VRServersKeysIndex from '@/pages/servers/keys/index'
import VRServersKeysCreate from '@/pages/servers/keys/create'

import VRServersNetworksIndex from '@/pages/servers/networks/index'
import VRServersNetworksCreate from '@/pages/servers/networks/create'

import VRServersToolsIndex from '@/pages/servers/tools/index'
import VRServersToolsShow from '@/pages/servers/tools/show'

import VRServersDBServersIndex from '@/pages/servers/dbservers/index'
import VRServersDBServersShow from '@/pages/servers/dbservers/show'

import VRServersDBServersDatabasesCreate from '@/pages/servers/dbservers/databases/create'
import VRServersDBServersDatabasesShow from '@/pages/servers/dbservers/databases/show'

import VRAppsIndex from '@/pages/apps/index'
import VRAppsCreate from '@/pages/apps/create'
import VRAppsShow from '@/pages/apps/show'

import VRAppsDeploysIndex from '@/pages/apps/deploys/index'

import VRAppsBootstrapStart from '@/pages/apps/bootstrap/start'
import VRAppsBootstrapTools from '@/pages/apps/bootstrap/tools'
import VRAppsBootstrapDomains from '@/pages/apps/bootstrap/domains'

import VRAppsCommandsIndex from '@/pages/apps/commands/index'
import VRAppsCommandsCreate from '@/pages/apps/commands/create'
import VRAppsCommandsShow from '@/pages/apps/commands/show'

import VRAppsDockerIndex from '@/pages/apps/docker/index'
import VRAppsDockerCreate from '@/pages/apps/docker/create'
import VRAppsDockerShow from '@/pages/apps/docker/show'
import VRAppsDockerEdit from '@/pages/apps/docker/edit'

import VRAppsDomainsIndex from '@/pages/apps/domains/index'
import VRAppsDomainsCreate from '@/pages/apps/domains/create'
import VRAppsDomainsShow from '@/pages/apps/domains/show'
import VRAppsDomainsEdit from '@/pages/apps/domains/edit'

import VRAppsSettings from '@/pages/apps/settings'

import VRCompaniesCreate from '@/pages/companies/create'

import VRTeamIndex from '@/pages/team/index'
import VRTeamInvite from '@/pages/team/invite'

import VRBillingIndex from '@/pages/billing/index'
import VRBillingHistory from '@/pages/billing/history'
import VRBillingPlan from '@/pages/billing/plan'

import VRProvidersIndex from '@/pages/providers/index'
import VRProvidersCreate from '@/pages/providers/create'

import VRSubscriptionInactive from '@/pages/subscription-inactive'

Vue.use(VueRouter)

var router = new VueRouter({
  mode: 'history',
  routes: [
  { 
    path: '/login', 
    name: 'login', 
    component: VRLogin,
    meta: { public: true }
  },
  { 
    path: '/reset-password', 
    name: 'reset-password', 
    component: VRResetPassword ,
    meta: { public: true }
  },
  { 
    path: '/recover', 
    name: 'recover', 
    component: VRRecover,
    meta: { public: true }
  },
  { 
    path: '/signup', 
    name: 'signup', 
    component: VRSignup,
    meta: { public: true }
  },
  {
    path: '/verify-account',
    name: 'verify-account',
    component: VRVerifyAccount,
    meta: { public: true }
  },
  {
    path: '/',
    name: 'dashboard',
    component: VRDashboard
  },
  {
    path: '/account',
    name: 'account',
    component: VRAccount
  },
  {
    path: '/support',
    name: 'support',
    component: VRSupport
  },
  {
    path: '/subscription-inactive',
    name: 'subscription-inactive',
    component: VRSubscriptionInactive
  },
  { 
    path: '/servers', 
    name: 'servers.index', 
    component: VRServersIndex 
  },
  { 
    path: '/servers/create',
     name: 'servers.create',
    component: VRServersCreate
  },
  { 
    path: '/servers/:serverID',
    name: 'servers.show',
    component: VRServersShow,
    children: [
      {
        path: 'apps',
        name: 'servers.apps.index',
        component: VRServersAppsIndex
      },
      {
        path: 'ssh',
        name: 'servers.keys.index',
        component: VRServersKeysIndex
      },
      {
        path: 'ssh/keys/create',
        name: 'servers.keys.create',
        component: VRServersKeysCreate
      },
      {
        path: 'network',
        name: 'servers.networks.index',
        component: VRServersNetworksIndex
      },
      {
        path: 'network/firewall-rules/create',
        name: 'servers.networks.create',
        component: VRServersNetworksCreate
      },
      {
        path: 'tools',
        name: 'servers.tools.index',
        component: VRServersToolsIndex
      },
      {
        path: 'tools/:toolName',
        name: 'servers.tools.show',
        component: VRServersToolsShow
      },
      {
        path: 'provisions',
        name: 'servers.provisions.index',
        component: VRServersProvisionsIndex
      },
      {
        path: 'provisions/:provisionID',
        name: 'servers.provisions.show',
        component: VRServersProvisionsShow
      },
      {
        path: 'settings',
        name: 'servers.settings',
        component: VRServersSettings
      },
      {
        path: 'database-servers',
        name: 'servers.dbservers.index',
        component: VRServersDBServersIndex
      },
      {
        path: 'database-servers/:databaseServerID',
        name: 'servers.dbservers.show',
        component: VRServersDBServersShow
      },
      {
        path: 'database-servers/:databaseServerID/databases/create',
        name: 'servers.dbservers.databases.create',
        component: VRServersDBServersDatabasesCreate
      },
      {
        path: 'database-servers/:databaseServerID/databases/:databaseID',
        name: 'servers.dbservers.databases.show',
        component: VRServersDBServersDatabasesShow
      }
    ]
  },
  {
    path: '/apps',
    name: 'apps.index',
    component: VRAppsIndex
  },
  {
    path: '/apps/create',
    name: 'apps.create',
    component: VRAppsCreate
  },
  {
    path: '/apps/:appID',
    name: 'apps.show',
    component: VRAppsShow,
    children: [
      {
        path: 'deploy',
        name: 'apps.deploys.index',
        component: VRAppsDeploysIndex
      },

      {
        path: 'commands',
        name: 'apps.commands.index',
        component: VRAppsCommandsIndex
      },
      {
        path: 'commands/create',
        name: 'apps.commands.create',
        component: VRAppsCommandsCreate
      },
      {
        path: 'commands/:commandID',
        name: 'apps.commands.show',
        component: VRAppsCommandsShow
      },
      {
        path: 'docker',
        name: 'apps.docker.index',
        component: VRAppsDockerIndex
      },
      {
        path: 'docker/create',
        name: 'apps.docker.create',
        component: VRAppsDockerCreate
      },
      {
        path: 'docker/:dockerID',
        name: 'apps.docker.show',
        component: VRAppsDockerShow
      },
      {
        path: 'docker/edit/:dockerID',
        name: 'apps.docker.edit',
        component: VRAppsDockerEdit
      },
      {
        path: 'domains',
        name: 'apps.domains.index',
        component: VRAppsDomainsIndex
      },
      {
        path: 'domains/create',
        name: 'apps.domains.create',
        component: VRAppsDomainsCreate
      },
      {
        path: 'domains/:domainID',
        name: 'apps.domains.show',
        component: VRAppsDomainsShow
      },
      {
        path: 'domains/:domainID/edit',
        name: 'apps.domains.edit',
        component: VRAppsDomainsEdit
      },
      {
        path: 'bootstrap',
        name: 'apps.bootstrap.start',
        component: VRAppsBootstrapStart
      },
      {
        path: 'bootstrap/tools',
        name: 'apps.bootstrap.tools',
        component: VRAppsBootstrapTools
      },
      {
        path: 'bootstrap/domains',
        name: 'apps.bootstrap.domains',
        component: VRAppsBootstrapDomains
      },
      {
        path: 'settings',
        name: 'apps.settings',
        component: VRAppsSettings
      },
    ]
  },
  {
    path: '/billing',
    name: 'billing.index',
    component: VRBillingIndex,
    children: [
      {
        path: 'history',
        name: 'billing.history',
        component: VRBillingHistory
      },
    ]
  },
  {
    path: '/billing/plan',
    name: 'billing.plan',
    component: VRBillingPlan
  },
  {
    path: '/companies/create',
    name: 'companies.create',
    component: VRCompaniesCreate
  },
  {
    path: '/team',
    name: 'team.index',
    component: VRTeamIndex
  },      
  {
    path: '/team/invite',
    name: 'team.invite',
    component: VRTeamInvite
  },   
  {
    path: '/providers',
    name: 'providers.index',
    component: VRProvidersIndex
  },
  {
    path: '/provides/add',
    name: 'providers.create',
    component: VRProvidersCreate
  },
  ]
})

router.beforeEach((to, from, next) => {
  var token = window.localStorage.getItem('vapor-red-session')
  if (to.meta.public && token) {
    router.push({ name: 'servers.index' })
    return
  }
  if (!to.meta.public && !token) {
    router.push({ name: 'login' })
    return
  }
  next()
})

export default router
