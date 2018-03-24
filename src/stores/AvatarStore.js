import { configure, decorate, observable, action, runInAction } from 'mobx'

import request from './request'

const MAX_RETURNED_RESULTS = 20

configure({ enforceActions: true })

class AvatarStore {
  avatar = {}
  searchUsers = []
  userRepos = []
  isSearchLoading = false

  setAvatar (newAvatar) {
    this.avatar = newAvatar || {}
  }

  async searchForUser (searchName) {
    runInAction(() => (this.isSearchLoading = true))

    const {data: {items = []}} = await request(`https://api.github.com/search/users?q=${searchName}`)

    runInAction(() => {
      this.searchUsers = items.slice(0, MAX_RETURNED_RESULTS)
      this.userRepos = []
      this.isSearchLoading = false
    })
  }

  async loadUserRepos (userName) {
    runInAction(() => (this.isSearchLoading = true))

    const {data: repos} = await request(`https://api.github.com/users/${userName}/repos`)

    runInAction(() => {
      this.userRepos = repos || []
      this.isSearchLoading = false
    })
  }
}

decorate(AvatarStore, {
  avatar: observable,
  searchUsers: observable,
  userRepos: observable,
  isSearchLoading: observable,

  setAvatar: action,
  searchForUser: action,
  loadUserRepos: action
})

export default new AvatarStore()
