const datasetIds = [127];


datasetIds.forEach(datasetId => {

  describe(`Dataset ${datasetId}`, { testIsolation: false }, function () {
    before(function () {
      cy.visit(`/datasets/${datasetId}?type=dataset`)
    });

    it("Landing page", function () {
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
      cy.get('.dataset-information-box > :nth-child(2) > a').should('have.attr', 'href').and('include', 'doi.org').then((href) => {
        cy.request(href).then((resp) => {
          expect(resp.status).to.eq(200);
          expect(resp.body).to.include(`datasets/${datasetId}/version`);
        })
      });

      // Should search for contributor in find data page
      cy.get(':nth-child(2) > .contributor-list > li > .el-tooltip > .tooltip-item > a').each($el => {
        cy.wrap($el).should('have.attr', 'href').and('include', '/data?type=').and('contains', '&search=');
      });

      // Check 'View other version' directs to Versions tab
      cy.get('.dataset-information-box > div').contains('View other versions').click();
      cy.get('.nuxt-link-exact-active').should('have.text', ' Versions ');
      cy.get('[style=""] > .heading2.mb-8').should('contain', 'Versions for this Dataset').and('be.visible')

      // Each DOI link should load correct version
      cy.get('.el-col-push-1 > a').each(($link) => {
        cy.wrap($link).should('have.attr', 'href').and('include', 'doi.org').then((href) => {
          cy.request(href).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.include(`datasets/${datasetId}/version`);
          })
        });
      })

      //Check 'Get Dataset' directs to files tab
      cy.contains('.button-container span', 'Get Dataset').click()
      cy.get('.nuxt-link-exact-active').should('have.text', ' Files ');
      cy.get('[style=""] > .heading2.mb-8').should('have.text', 'Download Dataset').and('be.visible')

      //Check 'Cite Dataset' directs to Cite tab
      cy.contains('.button-container span', 'Cite Dataset').click()
      cy.get('.nuxt-link-exact-active').should('have.text', ' Cite ');
      cy.get('.citation-details > .heading2').should('have.text', '\n    Dataset Citation\n  ').and('be.visible')
    });
    it("Abstract Tab", function () {
      // Should switch to 'Abstract'
      cy.contains('#datasetDetailsTabsContainer .style1', ' Abstract ').click();
      cy.get('.nuxt-link-exact-active').should('have.text', ' Abstract ');

      //The following regular expression should capture space and letters
      cy.get('.dataset-description-info').contains(/Study Purpose: *(.+)/).should('exist')
      cy.get('.dataset-description-info').contains(/Data (Collection|Collected): *(.+)/).should('exist')
      cy.get('.dataset-description-info').contains(/(Primary)? Conclusion(s)?: *(.+)/).should('exist')

      // Check for Experimental Design
      cy.get('.dataset-description-info').contains('Experimental Design:').should('exist')
      cy.get('.dataset-description-info').contains('Protocol Links:').should('exist')
      cy.get('.dataset-description-info').within(() => {
        cy.get('.link2').should('exist')
        cy.get('.link2').should('have.length.above', 0)
        cy.get('.link2').should('have.attr', 'href').and('include', 'https://doi.org/')
      })
      cy.get('.dataset-description-info').contains(/Experimental Approach: *(.+)/).should('exist')

      // Check for Subject Information
      cy.get('.dataset-description-info').contains('Subject Information:').should('exist')
      cy.get('.dataset-description-info').contains(/Anatomical structure: *(.+)/).should('exist')
      cy.get('.dataset-description-info').contains(/Species: *(.+)/).should('exist')
      cy.get('.dataset-description-info').contains(/Sex: *(.+)/).should('exist')
      cy.get('.dataset-description-info').contains(/Number of samples: *(.+)/).should('exist')

      // Check for Keywords
      cy.get('.dataset-description-info').contains(/Keywords: *(.+)/).should('exist')

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
      cy.get('.nuxt-link-exact-active').should('have.text', ' About ');

      // Check for content
      cy.get('.dataset-about-info').contains(/Title: *(.+)/).should('exist')
      cy.get('.dataset-about-info').contains(/First Published: *(.+)/).should('exist')
      cy.get('.dataset-about-info').contains(/Last Published: *(.+)/).should('exist')
      cy.get('.dataset-about-info').contains(/Contact Author: *(.+)/).should('exist')
      cy.get('.dataset-about-info').contains(/Award[(]s[)]: (.+)/).should('exist')
      cy.get('.dataset-about-info').contains(/Funding Program[(]s[)]: *(.+)/).should('exist')
      cy.get('.dataset-about-info').contains(/Associated project[(]s[)]: *(.+)/).should('exist')
      cy.get('.dataset-about-info').contains(/Institution[(]s[)]:  *(.+)/).should('exist')
      cy.get('.dataset-about-info').contains(/Associated project[(]s[)]: *(.+)/).should('exist')
      cy.get('.dataset-about-info').contains(/Version (.+) Revision (.+): *(.+)/).should('exist')
      cy.get('.dataset-about-info').contains(/Dataset DOI: *(.+)/).should('exist')

      // Check for email exist
      cy.get('.about-section-container > :nth-child(2) > :nth-child(2) > a').should('have.attr', 'href').and('include', 'mailto');

      //Match award link to associated project
      cy.get(':nth-child(11) > :nth-child(2) > a').invoke('attr', 'href').then(value => {
        cy.get(':nth-child(8) > :nth-child(2) > a').should('have.attr', 'href', value);
      });

      //match author to contributors
      cy.get('.about-section-container > :nth-child(2) > :nth-child(1)').invoke('text').then(value => {
        cy.get('.similar-datasets-container').contains(new RegExp(value, 'i'));
      })
    });
    it("Cite Tab", function () {
      // Should switch to 'Cite'
      cy.contains('#datasetDetailsTabsContainer .style1', ' Cite ').click();
      cy.get('.nuxt-link-exact-active').should('have.text', ' Cite ');

      cy.get('.dataset-information-box > :nth-child(2) > a > u').invoke('text').then(value => {
        // Check for citation doi
        cy.get('.info-citation > .citation-text').should('contain', value.toUpperCase())

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
          cy.get('.nuxt-link-exact-active').should('have.text', ' Files ');

          // Check for content
          cy.get('[style=""] > .heading2.mb-8').should('have.text', 'Download Dataset');
          cy.get('.left-column > :nth-child(1) > div > .label4').should('have.text', 'Option 1 - Direct download: ');
          cy.get('.aws-download-column > :nth-child(1) > .label4').should('have.text', 'Option 2 - AWS download: ');

          // Check for download button
          cy.contains('Dataset size').parent().then(($size) => {
            const size = parseInt($size.text().match(/[0-9]+/i)[0])
            if ($size.text().includes("GB") && size > 5) {
              cy.get('.el-tooltip > .el-button').should('not.be.enabled')
            } else {
              cy.get('.left-column > :nth-child(1) > a > .el-button').should('be.enabled')
            }
          })
          cy.get('.left-column .el-button').contains('Download full dataset').should('be.visible');

          //Find the download file button
          cy.contains('.content .body1 .el-table__fixed-body-wrapper .el-table__row', ' dataset_description.xlsx ').should('have.length', 1).as('datasetDescription');
          cy.get('@datasetDescription').find('.el-table_1_column_5').should('have.length', 1).as('icons');
          cy.get('@icons').find('form[id=zipForm]').should('have.length', 1);

          //there should be 4 icons, one for each action
          cy.get('@icons').find('svg').should('have.length', 4);

          //Check get share links
          cy.get('@icons').find(':nth-child(4)').click({ force: true });
          cy.get('.el-message').should('be.visible').and('have.text', 'File URL copied to clipboard.')

          //Check oSPARC link
          cy.get('@icons').find(':nth-child(3) > .el-tooltip > .svg-icon').click({ force: true });
          cy.get('.files-table-table .el-dialog  .svg-icon').click();
        } else {
          this.skip();
        }
      });
    });
    it("Gallery Tab", function () {
      // Should switch to 'Gallery'
      cy.contains('#datasetDetailsTabsContainer .style1', ' Gallery ').click();
      cy.get('.nuxt-link-exact-active').should('have.text', ' Gallery ');

      cy.get('.content > .full-size').then(($content) => {
        //The following call may fail if the wait() is not implemented here
        cy.wait(500);
        const gallery = $content.find('.gallery-container');
        if (gallery && gallery.length) {
          // Check for pagination
          cy.wrap(gallery).find('.sparc-design-system-pagination').as('pagination');
          cy.get('@pagination').find('li.number').should('have.length.least', 1);

          // Check for gallery card
          cy.wrap(gallery).find('.el-card').should('have.length.least', 1).each($card => {
            cy.wrap($card).contains('span', ' View ');
            //***Need to test newly opened viewers
          });
        } else {
          cy.wrap($content).contains(' This dataset does not contain gallery items ');
        }
      });
    });
    it("References Tab", function () {
      //First check if reference tab is present
      cy.get('#datasetDetailsTabsContainer .style1').then(($tab) => {
        if ($tab.text().includes(' References ')) {
          // Should switch to 'References' if exist
          cy.contains('#datasetDetailsTabsContainer .style1', ' References ').click();
          cy.get('.nuxt-link-exact-active').should('have.text', ' References ');

          // Check for content
          cy.get('.dataset-references .heading2').contains('Associated Publications for this Dataset');
          cy.get('.dataset-references .citation-container').each(el => {
            cy.wrap(el).find('div > a').should('have.attr', 'href').and('include', 'doi.org');
            cy.wrap(el).find('.copy-button').click();
            cy.get('.el-message').should('be.visible').and('have.text', 'Successfully copied citation.')
          });
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
          cy.get('.nuxt-link-exact-active').should('have.text', ' Versions ');

          // Check for file actions
          cy.get('.version-table > :nth-child(2) > :nth-child(4)').then(($el) => {
            if ($el.text().includes('Not available')) {
              cy.wrap($el).should('contain', 'Not available')
            } else {
              cy.wrap($el).get('.el-tooltip > .svg-icon:visible').should('have.length', 2)
              cy.get(':nth-child(4) > :nth-child(1) > .el-tooltip > .svg-icon').click()
              cy.get('.optional-content-container').should('be.visible');
              cy.get('.main-content-container').should('be.visible');
              cy.get('.close-icon > path').click();
            }
          })

          // Check for link
          cy.get('.table-rows .el-col-push-1 > a').each($el => {
            cy.wrap($el).should('have.attr', 'href').and('include', 'doi.org').then((href) => {
              cy.request(href).its('body').should('include', `/datasets/${datasetId}/version`);
            })
          });
        }
      });
    });
    it("Landing page project page", function () {
      cy.get('.mt-8 > a > u').click()
      cy.get('.subpage').click()
      cy.get('.heading2').should('be.visible')
      cy.url().should('include', '/projects/')
    });
  });

});