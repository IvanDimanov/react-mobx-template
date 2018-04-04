import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withStyles } from 'material-ui/styles'
import LazyLoad from 'react-lazy-load'

import AvatarStore from 'stores/AvatarStore'

import Grid from 'material-ui/Grid'
import TextField from 'material-ui/TextField'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'

import CenteredGrid from 'common/CenteredGrid'

const styles = {
  CenteredGrid: {
    width: 1000
  },

  Card: {
    display: 'inline-block',
    width: 150,
    margin: 10
  },

  CardMedia: {
    height: 200
  }
}

class Avatar extends Component {
  state = {
    searchName: ''
  }

  setSearchName = (event) => {
    const { value } = event.target
    this.setState((state) => ({ ...state, searchName: value }))
  }

  renderUser = (result, index) => {
    const { classes } = this.props
    const isSearchLoading = AvatarStore.isSearchLoading

    return <Card
      key={index}
      className={classes.Card}
    >
      <LazyLoad height={styles.CardMedia.height}>
        <CardMedia
          title={`Image of ${result.login}`}
          image={result.avatar_url}
          className={classes.CardMedia}
        />
      </LazyLoad>

      <CardContent>
        <Typography type='headline' component='h2' noWrap>{result.login}</Typography>

        <Typography component='p'><b>Score:</b> {result.score}</Typography>
      </CardContent>

      <CardActions>
        <Button
          size='small'
          color='primary'
          onClick={() => AvatarStore.loadUserRepos(result.login)}
          disabled={isSearchLoading}
        >
          Load Repos
        </Button>

        <Button
          size='small'
          color='primary'
          onClick={() => AvatarStore.setAvatar(result)}
        >
          Set as Avatar
        </Button>
      </CardActions>
    </Card>
  }

  renderUserRepo = (repo, index) => {
    const { classes } = this.props

    return <Card
      key={index}
      className={classes.Card}
    >
      <CardContent>
        <Typography type='headline' component='h2' noWrap>{repo.name}</Typography>
        <Typography component='p'><b>Language: </b> {repo.language}</Typography>
        <br />
        <Typography component='p'>{repo.description}</Typography>
      </CardContent>

      <CardActions>
        <Button
          size='small'
          color='primary'
          onClick={() => window.open(repo.html_url)}
        >
          View Online
        </Button>

        <Button
          size='small'
          color='primary'
          onClick={() => window.open(repo.homepage)}
          disabled={!repo.homepage}
        >
          Home page
        </Button>
      </CardActions>
    </Card>
  }

  render () {
    const { searchName } = this.state
    const { classes } = this.props
    const isSearchLoading = AvatarStore.isSearchLoading
    const searchUsers = AvatarStore.searchUsers
    const userRepos = AvatarStore.userRepos

    return <CenteredGrid className={classes.CenteredGrid}>
      <TextField
        type='search'
        label='Search GitHub User'
        value={searchName}
        onChange={this.setSearchName}
        onKeyPress={(event) => event.key === 'Enter' ? AvatarStore.searchForUser(searchName) : null}
        disabled={isSearchLoading}
        autoFocus
      />

      <br />
      <br />

      <Grid container>
        <Grid item xs={7}>
          {searchUsers.length
            ? searchUsers.map(this.renderUser)
            : <Typography component='p'>No users found</Typography>
          }
        </Grid>

        <Grid item xs={5}>{userRepos.map(this.renderUserRepo)}</Grid>
      </Grid>
    </CenteredGrid>
  }
}

export default withStyles(styles)(observer(Avatar))
