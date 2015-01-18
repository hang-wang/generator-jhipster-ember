package <%=packageName%>.web.filter;

import org.tuckey.web.filters.urlrewrite.Conf;
import org.tuckey.web.filters.urlrewrite.UrlRewriteFilter;
import org.tuckey.web.filters.urlrewrite.utils.Log;

import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import java.io.InputStream;

/**
 *
 */
public class CustomUrlRewriteFilter extends UrlRewriteFilter {
    private static Log log = Log.getLog(UrlRewriteFilter.class);

    @Override
    protected void loadUrlRewriter(FilterConfig filterConfig) throws ServletException {
        try {
            String confPath = filterConfig.getInitParameter("confPath");
            InputStream inputStream =  this.getClass().getClassLoader().getResourceAsStream(confPath);

            Conf conf = new Conf(filterConfig.getServletContext(), inputStream, confPath, "");
            checkConf(conf);
        } catch(Throwable e) {
            log.error(e);
            throw new ServletException(e);
        }
    }
}
