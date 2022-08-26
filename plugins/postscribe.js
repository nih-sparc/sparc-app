import postscribe from 'postscribe'

export default (_, inject) => {
  inject('injectNewsletterArchive', elementSelector => {
    postscribe(
      elementSelector,
      '<script language="javascript" src="//science.us2.list-manage.com/generate-js/?u=e60c48f231a30b544eed731ea&fid=46414&show=1" type="text/javascript"></script>'
    )
  })
}
