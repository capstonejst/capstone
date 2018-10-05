import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  GridListTile,
  GridListTileBar,
  IconButton,
  GridList,
  Grid,
  Typography
} from '@material-ui/core/'

import StarBorderIcon from '@material-ui/icons/StarBorder'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)'
  },
  title: {
    color: '#fff'
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
  },
  adsTitles: {
    fontSize: '18px',
    fontWeight: '600'
  }
})

function AdsGalleryGridList(props) {
  const { classes, ads } = props

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={16}>
        <Grid item xs={12}>
          <Typography className={classes.adsTitles} variant="body1">
            Ads
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <GridList className={classes.gridList} cols={2.5}>
            {ads.map(ad => (
              <GridListTile key={ad.id}>
                <img src={ad.image} alt={ad.name} />
              </GridListTile>
            ))}
          </GridList>
        </Grid>
      </Grid>
    </div>
  )
}

AdsGalleryGridList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AdsGalleryGridList)
