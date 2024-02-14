const datasetIds = [127];
// const datasetIds = [127, 282, 290, 34, 76];


datasetIds.forEach(datasetId => {

  describe(`Dataset ${datasetId}`, { testIsolation: false }, function () {
    before(function () {
      cy.intercept('**/dataset_info/using_doi?**').as('dataset_info')
      cy.intercept('**/knowledge/query/**').as('flatmap')
      cy.visit(`/datasets/${datasetId}?type=dataset`)
    });

    it("Gallery Tab", function () {
      // Should switch to 'Gallery'
      cy.contains('#datasetDetailsTabsContainer .style1', ' Gallery ').click();
      cy.get('.nuxt-link-exact-active').should('contain', ' Gallery ');

      cy.wait(5000)

      cy.get('.content > .full-size', { timeout: 30000 }).then(($content) => {
        const gallery = $content.find('.gallery-container');
        if (gallery && gallery.length) {
          // Check for pagination
          cy.wrap(gallery).find('.sparc-design-system-pagination').as('pagination');
          cy.get('@pagination').find('li.number').should('have.length.least', 1);

          // Check for gallery card
          cy.wrap(gallery).find('.el-card').as('card').should('have.length.least', 1)
          cy.get('@card').first().within(($card) => {
            cy.wrap($card).get('.cursor-pointer > img').should('be.visible').and('have.prop', 'naturalWidth').should('be.greaterThan', 0)
            cy.wrap($card).contains('span', ' View ')
          });

          // Only check for dataset when it has valid flatmap data
          cy.wait('@dataset_info').then((intercept) => {
            if (intercept.response.body.result[0].organs) {
              cy.wait('@flatmap').then((intercept) => {
                if (intercept.response.body.values.length > 0) {
                  cy.findGalleryCard('flatmap', 'prev');
                  cy.get('.el-card > .el-card__body').should('contain', 'flatmap');
                }
              })
            }
          })
        } else {
          cy.wrap($content).contains(' This dataset does not contain gallery items ');
        }
      });
    });
    it("Landing page", function () {
      cy.intercept('**/query?**').as('query')

      // Should display image with correct dataset src
      cy.get('.dataset-image').should('have.attr', 'src').and('include', `https://assets.discover.pennsieve.io/dataset-assets/${datasetId}`)

      // Check for tooltip when hover over author 
      cy.get('.dataset-owners > :nth-child(2) > .contributor-item').then(($orcid) => {
        if ($orcid.hasClass('has-orcid')) {
          cy.wrap($orcid).trigger('mouseenter', { eventConstructor: 'MouseEvent' })
          //only one visible popover
          cy.get('.orcid-popover:visible').should('have.length', 1)
        }
      })

      // Should reload the page
      cy.get('.dataset-information-box > :nth-child(2) > a').click()
      cy.origin('https://sparc.science', () => {
        cy.url().should('contain', 'version')
        cy.go('back')
      })
      // cy.get('.dataset-information-box > :nth-child(2) > a').should('have.attr', 'href').and('include', 'doi.org').then((href) => {
      //   cy.request(href).then((resp) => {
      //     expect(resp.status).to.eq(200);
      //     expect(resp.body).to.include(`datasets/${datasetId}/version`);
      //   })
      // });

      // Should search for contributor in find data page
      cy.get(':nth-child(2) > .contributor-list > li > .el-tooltip > .tooltip-item > a').then(($name) => {
        cy.wrap($name).click()

        cy.wait('@query', { timeout: 20000 })

        cy.get('.table-wrap.el-loading-parent--relative > .el-loading-mask', { timeout: 30000 }).should('not.exist')

        // Check for result
        cy.get(':nth-child(1) > p > .el-dropdown > .filter-dropdown').should('be.visible').click()
        cy.get('.el-dropdown-menu > .el-dropdown-menu__item:visible').contains('View All').click()

        let datasetShowUp = false
        cy.get('.img-dataset > img').each(($img) => {
          cy.wrap($img).invoke('attr', 'src').then((src) => {
            datasetShowUp = datasetShowUp || src.includes(datasetId)
          })
        }).then(() => {
          if (!datasetShowUp) {
            throw new Error("Can not find the dataset for current contributor")
          }
        })

        // Check for URL and search input
        cy.url({ decode: true }).should('contain', `search=${$name.text()}`)
        cy.get('.el-input__inner').should('have.value', $name.text());
        cy.go('back')
      });

      // Check 'View other version' directs to Versions tab
      cy.get('.dataset-information-box > div').contains('View other versions').click();
      cy.get('.nuxt-link-exact-active').should('contain', ' Versions ');
      cy.get('[style=""] > .heading2.mb-8').should('contain', 'Versions for this Dataset').and('be.visible')

      //Check 'Get Dataset' directs to files tab
      cy.contains('.button-container span', 'Get Dataset').click()
      cy.get('.nuxt-link-exact-active').should('contain', ' Files ');
      cy.get('[style=""] > .heading2.mb-8').should('have.text', 'Download Dataset').and('be.visible')

      //Check 'Cite Dataset' directs to Cite tab
      cy.contains('.button-container span', 'Cite Dataset').click()
      cy.get('.nuxt-link-exact-active').should('contain', ' Cite ');
      cy.get('.citation-details > .heading2').should('have.text', '\n    Dataset Citation\n  ').and('be.visible')
    });
    it("Abstract Tab", function () {
      // Should switch to 'Abstract'
      cy.contains('#datasetDetailsTabsContainer .style1', ' Abstract ').click();
      cy.get('.nuxt-link-exact-active').should('contain', ' Abstract ');

      //The following regular expression should capture space and letters
      cy.get('.dataset-description-info > .col-xs-12.description-container > p').contains(/Study Purpose: (.+)/).should('exist')
      cy.get('.dataset-description-info > .col-xs-12.description-container > p').contains(/Data (Collection|Collected):(.+)/).should('exist')
      cy.get('.dataset-description-info > .col-xs-12.description-container > p').contains(/(Primary )?Conclusion(s)?: (.+)/).should('exist')

      // Check for Experimental Design
      cy.get('.dataset-description-info > .mb-8').contains('Experimental Design:').should('exist')
      cy.get('.dataset-description-info').contains('Protocol Links:').should('exist')
      cy.get('.dataset-description-info').within(($el) => {
        if ($el.text().includes('https://doi.org/')) {
          cy.get('.link2').should('exist')
          cy.get('.link2').should('have.length.above', 0)
          cy.get('.link2').should('have.attr', 'href').and('include', 'https://doi.org/')
        }
      })
      cy.get('.dataset-description-info > .experimental-design-container').contains(/Experimental Approach: (.+)/).should('exist')

      // Check for Subject Information
      cy.get('.dataset-description-info > .mb-8').contains('Subject Information:').should('exist')
      cy.get('.dataset-description-info > .experimental-design-container').contains(/Anatomical structure: (.+)/).should('exist')
      cy.get('.dataset-description-info > .experimental-design-container').contains(/Species: (.+)/).should('exist')
      cy.get('.dataset-description-info > .experimental-design-container').contains(/Sex: (.+)/).should('exist')
      cy.get('.dataset-description-info > .experimental-design-container').contains(/Number of samples: (.+)/).should('exist')

      // Check for Keywords
      cy.get('.dataset-description-info').contains(/Keywords: (.+)/).should('exist')

      // Check for downloading
      cy.contains('.dataset-description-info a', 'Download Metadata file').should('have.attr', 'href').and('include', 'metadata').then((href) => {
        cy.request(href).then((resp) => {
          expect(resp.status).to.eq(200)
        })
      })
    });
    it("About Tab", function () {
      // Should switch to 'About'
      cy.contains('#datasetDetailsTabsContainer .style1', ' About ').click();
      cy.get('.nuxt-link-exact-active').should('contain', ' About ');

      // Check for content
      cy.get('.dataset-about-info > .mb-16').contains(/Title: (.+)/).should('exist')
      cy.get('.dataset-about-info > .mb-16').contains(/First Published: (.+)/).should('exist')
      cy.get('.dataset-about-info > .mb-16').contains(/Last Published: (.+)/).should('exist')
      cy.get('.dataset-about-info > .about-section-container').contains(/Contact Author: (.+)/).within(($el) => {
        // Check for email link exist
        cy.wrap($el).get(':nth-child(2) > :nth-child(2) > a').should('have.attr', 'href').and('include', 'mailto:');
      })
      cy.get('.dataset-about-info > .mb-16').contains(/Award[(]s[)]: (.+)/).should('exist')
      cy.get('.dataset-about-info > .mb-16').contains(/Funding Program[(]s[)]: (.+)/).should('exist')
      cy.get('.dataset-about-info > .mb-16').contains(/Associated project[(]s[)]: (.+)/).should('exist')
      cy.get('.dataset-about-info > .mb-16').contains(/Institution[(]s[)]: (.+)/).should('exist')
      cy.get('.dataset-about-info > .mb-16').contains(/Version (.+) Revision (.+): (.+)/).should('exist')
      cy.get('.dataset-about-info > .mb-16').contains(/Dataset DOI: (.+)/).should('exist')

      /**
       * Contact Author may not be the contributor
       * If should be, uncomment following code
       */
      // //match author to contributors
      // cy.get('.about-section-container > :nth-child(2) > :nth-child(1)').invoke('text').then((value) => {
      //   const author = new RegExp(value.replace(/\s+/, ' '), 'i')
      //   cy.get('.similar-datasets-container').contains(author);
      // })

      // Ignore tests if project not exist
      cy.get('.similar-datasets-container').then(($content) => {
        if ($content.text().includes('project(s):')) {
          //Match award link to associated project
          cy.get(':nth-child(11) > :nth-child(2) > a').invoke('attr', 'href').then((value) => {
            cy.get(':nth-child(8) > :nth-child(2) > a').should('have.attr', 'href', value);
          });

          cy.get('.dataset-about-info').contains(/Institution[(]s[)]: (.+)/).children().not('.label4').invoke('text').then((value) => {
            cy.get('.mt-8 > a').click()
            cy.url({ timeout: 30000 }).should('contain', 'projects')

            // Check for the institution 
            const institution = value.match(/[ a-zA-Z]+/)[0].trim()
            cy.get('.body1 > :nth-child(6)').should('contain', institution);
            cy.go('back')
          })
        }
      })
    });
    it("Cite Tab", function () {
      // Should switch to 'Cite'
      cy.contains('#datasetDetailsTabsContainer .style1', ' Cite ').click();
      cy.get('.nuxt-link-exact-active').should('contain', ' Cite ');

      // Check for title
      cy.get('.bx--col-md-6 > .heading2').invoke('text').then((value) => {
        cy.get('.info-citation > .citation-text', { timeout: 30000 }).should('contain', value.trim())
      })

      cy.get('.dataset-information-box > :nth-child(2) > a > u').invoke('text').then((value) => {
        // Check for citation doi
        cy.get('.info-citation > .citation-text', { timeout: 30000 }).should('contain', value.toUpperCase())

        // Check for source link
        const expectedLink = 'https://citation.crosscite.org/?doi=' + value;
        cy.get('.citation-details > p > a').should('have.attr', 'href', expectedLink);
      })
    });
    it("Files Tab", function () {
      //First check if there is a Files tab
      cy.get('#datasetDetailsTabsContainer .style1').then(($tab) => {
        if ($tab.text().includes(' Files ')) {
          // Should switch to 'Files' if exist
          cy.contains('#datasetDetailsTabsContainer .style1', ' Files ').click();
          cy.get('.nuxt-link-exact-active').should('contain', ' Files ');

          // Check for content
          cy.get('[style=""] > .heading2.mb-8').should('have.text', 'Download Dataset');
          cy.get('.left-column > :nth-child(1) > div > .label4').should('have.text', 'Option 1 - Direct download: ');
          cy.get('.aws-download-column > :nth-child(1) > .label4').should('have.text', 'Option 2 - AWS download: ');

          // Check for download full dataset button
          cy.get('.left-column .el-button').contains('Download full dataset').should('be.visible');
          cy.contains('Dataset size').parent().then(($size) => {
            const size = parseFloat($size.text().match(/[0-9]+(.[0-9]+)?/i)[0])
            if ($size.text().includes("GB") && size > 5) {
              cy.get('.el-tooltip > .el-button').should('not.be.enabled')
            } else {
              cy.get('.left-column > :nth-child(1) > a > .el-button').should('be.enabled')
            }
          })

          // Check for help link
          cy.get('.aws-download-column > :nth-child(1) > a').should('have.attr', 'href', 'https://docs.sparc.science/docs/accessing-public-datasets');
          cy.get('.aws-download-column > :nth-child(3) > a').should('have.attr', 'href', 'https://aws.amazon.com/s3/pricing/');

          //Find the download file button
          cy.contains('.content .body1 .el-table__fixed-body-wrapper .el-table__row', ' dataset_description.xlsx ').should('have.length', 1).as('datasetDescription');

          //there should be 4 icons, one for each action
          cy.get('@datasetDescription').find('.svg-icon').should('have.length', 4).as('icons')

          //Check get share links
          cy.get('@icons').eq(3).click({ force: true });
          cy.get('.el-message').should('be.visible').and('have.text', 'File URL copied to clipboard.')

          //Check oSPARC link
          cy.get('@icons').eq(2).click({ force: true });
          cy.get('.files-table-table .el-dialog  .svg-icon').click({ force: true });

          // Check for files breadcrumb
          cy.get('.inline > .dataset-link').should('have.attr', 'href', 'https://docs.sparc.science/docs/accessing-public-datasets');
          cy.get('.breadcrumb-link').should('have.class', 'breadcrumb-link');
          cy.get('.breadcrumb-link').should('have.attr', 'href').and('contain', 'datasetDetailsTab=files&path=files');
          cy.get('.el-table__body-wrapper > .el-table__body > tbody > .el-table__row').then(($table) => {
            if ($table.text().includes('Folder')) {
              cy.get('.breadcrumb-link').should('have.length', 1)
              cy.wrap($table).filter(':contains("Folder")').first().within(($link) => {
                cy.wrap($link).get('.file-name-wrap > .el-tooltip > .file-name').click({ force: true })
              })
              cy.get('.breadcrumb-link').should('have.length', 2)
              cy.get(':nth-child(1) > .breadcrumb-link').click()
              cy.get('.breadcrumb-link').should('have.length', 1)
            }
          })
        } else {
          this.skip();
        }
      });
    });
    it("References Tab", function () {
      //First check if reference tab is present
      cy.get('#datasetDetailsTabsContainer .style1').then(($tab) => {
        if ($tab.text().includes(' References ')) {
          // Should switch to 'References' if exist
          cy.contains('#datasetDetailsTabsContainer .style1', ' References ').click();
          cy.get('.nuxt-link-exact-active').should('contain', ' References ');

          // Check for content
          cy.get('.dataset-references .heading2').contains('Associated Publications for this Dataset');
          cy.get('.dataset-references .citation-container').each(el => {
            cy.wrap(el).find('div > a').should('have.attr', 'href').and('include', 'doi.org');
            cy.wrap(el).find('.copy-button').click();
            cy.get('.el-message').should('be.visible').and('contain', 'Successfully copied citation.')
          });

          // Check if redundant doi exist
          let doiList = []
          cy.get('.dataset-references').then(($content) => {
            if (
              $content.text().includes('Primary Publications for this Dataset') &&
              $content.text().includes('Preprints')
            ) {
              cy.get('.dataset-references .citation-container > div > a').each($doi => {
                cy.wrap($doi).invoke('attr', 'href').then((link) => {
                  if (!doiList.includes(link)) {
                    doiList.push(link)
                  } else {
                    throw new Error("Redundant doi is found")
                  }
                })
              });
            }
          })
        } else {
          this.skip();
        }
      });
    });
    it("Versions Tab", function () {
      //First check if version tab is present
      cy.get('#datasetDetailsTabsContainer .style1').then(($tab) => {
        if ($tab.text().includes(' Versions ')) {
          // Should switch to 'Versions' if exist
          cy.contains('#datasetDetailsTabsContainer .style1', ' Versions ').click();
          cy.get('.nuxt-link-exact-active').should('contain', ' Versions ');

          // Check for file actions
          cy.get('.version-table > :nth-child(2) > :nth-child(4)').then(($cell) => {
            if ($cell.text().includes('Not available')) {
              cy.wrap($cell).should('contain', 'Not available')
            } else {
              // Check for changelog
              cy.wrap($cell).find('.svg-icon').as('icons').should('have.length', 2)
              cy.get('@icons').eq(0).click()

              // Check for changelog popover
              cy.get('.optional-content-container').should('be.visible');
              cy.get('.main-content-container').should('be.visible');
              cy.get('.close-icon > path').click();

              // Check for download
              cy.intercept('**/zipit/discover').as('changelogDownload')
              cy.get('@icons').eq(1).click({ force: true })
              cy.get('@changelogDownload').should(({ request, response }) => {
                expect(request.method).to.equal('POST')
                expect(request.body.data.datasetId).to.equal(`${datasetId}`)
                expect(response.statusCode).to.equal(200)
              })
            }
          })

          // DOI link should reload page with correct version
          cy.get(':nth-child(2) > .el-col-push-1 > a').click()
          cy.origin('https://sparc.science', () => {
            cy.url().should('contain', 'version')
            cy.go('back')
          })
          // cy.get('.el-col-push-1 > a').each(($link) => {
          //   cy.wrap($link).should('have.attr', 'href').and('include', 'doi.org').then((href) => {
          //     cy.request(href).then((resp) => {
          //       expect(resp.status).to.eq(200);
          //       expect(resp.body).to.include(`datasets/${datasetId}/version`);
          //     })
          //   });
          // })
        }
      });
    });
  });
});