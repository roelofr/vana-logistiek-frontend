import type { Issue } from '~/types'

export interface ListIssue extends Pick<Issue, 'id' | 'subject' | 'createdAt' | 'updatedAt' | 'resolvedAt' | 'vendor' | 'user' | 'group'> {
  read: boolean
}

export enum LoadingState {
  Initial, Update, Idle,
}

export const useIssueStore = defineStore('issueStore', {
  state: () => ({
    _isLoading: false,
    loadingState: LoadingState.Initial,
    issues: [] as ListIssue[],
    unreadIssues: [] as number[],
    activeIssueId: null as number | null,
  }),
  getters: {
    activeIssue(state) {
      return state.activeIssueId !== null
        ? state.issues.find(ticket => ticket.id === state.activeIssueId) ?? null
        : null
    },
  },
  actions: {
    async fetch() {
      // Check loading flag
      if (this._isLoading)
        return
      this._isLoading = true

      // Check if this might be a re-load
      if (this.loadingState == LoadingState.Idle)
        this.loadingState = LoadingState.Update

      const issues = await $fetch<Issue[]>('/api/issue')

      this.issues = expand(issues, ['user', 'vendor', 'group'])
      this.unreadIssues = issues.filter(ticket => !ticket.read).map(ticket => ticket.id)

      this.loadingState = LoadingState.Idle
      this._isLoading = false
    },

    setActiveIssue(issue: number | Issue | null) {
      if (issue === null)
        this.activeIssueId = null
      else if (typeof issue === 'number')
        this.activeIssueId = issue
      else
        this.activeIssueId = issue.id
    },
  },
})
